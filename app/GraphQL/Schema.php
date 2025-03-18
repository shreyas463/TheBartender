<?php

namespace App\GraphQL;

use App\GraphQL\Types\CocktailType;
use App\Models\Cocktail;
use App\Services\CocktailApiService;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema as GraphQLSchema;
use Illuminate\Support\Facades\Log;

class Schema
{
    private static $cocktailType = null;
    private static $queryType = null;
    private static $cocktailApiService = null;

    public static function cocktailType(): CocktailType
    {
        return self::$cocktailType ?: (self::$cocktailType = new CocktailType());
    }

    private static function getCocktailApiService(): CocktailApiService
    {
        return self::$cocktailApiService ?: (self::$cocktailApiService = new CocktailApiService());
    }

    public static function queryType(): ObjectType
    {
        return self::$queryType ?: (self::$queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'cocktails' => [
                    'type' => Type::listOf(self::cocktailType()),
                    'args' => [
                        'search' => Type::string(),
                    ],
                    'resolve' => function ($root, $args) {
                        $apiService = self::getCocktailApiService();
                        $cocktails = [];

                        if (isset($args['search'])) {
                            $apiResults = $apiService->searchCocktails($args['search']);
                            foreach ($apiResults as $result) {
                                $cocktails[] = $apiService->transformApiResponse($result);
                            }
                        } else {
                            // If no search term, get a random selection
                            for ($i = 0; $i < 10; $i++) {
                                $randomCocktail = $apiService->getRandomCocktail();
                                if ($randomCocktail) {
                                    $cocktails[] = $apiService->transformApiResponse($randomCocktail);
                                }
                            }
                        }

                        return $cocktails;
                    }
                ],
                'cocktail' => [
                    'type' => self::cocktailType(),
                    'args' => [
                        'id' => Type::nonNull(Type::id()),
                    ],
                    'resolve' => function ($root, $args) {
                        $apiService = self::getCocktailApiService();
                        $cocktail = $apiService->getCocktailById($args['id']);
                        return $cocktail ? $apiService->transformApiResponse($cocktail) : null;
                    }
                ],
            ],
        ]));
    }

    public static function build(): GraphQLSchema
    {
        // Initialize the schema with query type
        try {
            return new GraphQLSchema([
                'query' => self::queryType(),
            ]);
        } catch (\Exception $e) {
            Log::error('Schema build error: ' . $e->getMessage());
            throw $e;
        }
    }
}
