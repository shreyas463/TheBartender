<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cocktail extends Model
{
    protected $fillable = [
        'name',
        'description',
        'instructions',
        'ingredients',
        'image_url',
        'glass_type',
        'category',
        'is_alcoholic',
    ];

    protected $casts = [
        'ingredients' => 'array',
        'is_alcoholic' => 'boolean',
    ];
}
