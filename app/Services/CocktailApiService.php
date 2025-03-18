<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CocktailApiService
{
    private string $baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1';
    private const CACHE_TTL = 3600; // 1 hour cache

    public function searchCocktails(string $query)
    {
        $cacheKey = 'cocktail_search_' . md5($query);
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($query) {
            try {
                $response = Http::get("{$this->baseUrl}/search.php", ['s' => $query]);
                return $response->json()['drinks'] ?? [];
            } catch (\Exception $e) {
                Log::error('CocktailDB API Error: ' . $e->getMessage());
                return [];
            }
        });
    }

    public function getCocktailById(string $id)
    {
        $cacheKey = 'cocktail_' . $id;
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($id) {
            try {
                $response = Http::get("{$this->baseUrl}/lookup.php", ['i' => $id]);
                return $response->json()['drinks'][0] ?? null;
            } catch (\Exception $e) {
                Log::error('CocktailDB API Error: ' . $e->getMessage());
                return null;
            }
        });
    }

    public function getRandomCocktail()
    {
        try {
            $response = Http::get("{$this->baseUrl}/random.php");
            return $response->json()['drinks'][0] ?? null;
        } catch (\Exception $e) {
            Log::error('CocktailDB API Error: ' . $e->getMessage());
            return null;
        }
    }

    public function transformApiResponse(array $cocktail): array
    {
        $ingredients = [];
        for ($i = 1; $i <= 15; $i++) {
            $ingredient = $cocktail["strIngredient{$i}"] ?? null;
            $measure = $cocktail["strMeasure{$i}"] ?? null;
            
            if ($ingredient) {
                $ingredients[] = [
                    'name' => trim($ingredient),
                    'measure' => $measure ? trim($measure) : null,
                ];
            }
        }

        return [
            'id' => $cocktail['idDrink'],
            'name' => $cocktail['strDrink'],
            'image' => $cocktail['strDrinkThumb'],
            'instructions' => $cocktail['strInstructions'],
            'ingredients' => $ingredients,
            'glass' => $cocktail['strGlass'] ?? null,
            'category' => $cocktail['strCategory'] ?? null,
            'alcoholic' => $cocktail['strAlcoholic'] ?? null,
        ];
    }
}
