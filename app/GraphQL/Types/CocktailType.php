<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CocktailType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'Cocktail',
            'description' => 'A cocktail recipe',
            'fields' => [
                'id' => Type::nonNull(Type::id()),
                'name' => Type::nonNull(Type::string()),
                'image' => Type::string(),
                'instructions' => Type::nonNull(Type::string()),
                'ingredients' => Type::listOf(new ObjectType([
                    'name' => 'Ingredient',
                    'fields' => [
                        'name' => Type::nonNull(Type::string()),
                        'measure' => Type::string(),
                    ],
                ])),
                'glass' => Type::string(),
                'category' => Type::string(),
                'alcoholic' => Type::string(),
            ],
        ];

        parent::__construct($config);
    }
}
