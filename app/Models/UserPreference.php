<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'favorite_ingredients',
        'disliked_ingredients',
        'prefer_alcoholic',
        'favorite_cocktails',
    ];

    protected $casts = [
        'favorite_ingredients' => 'array',
        'disliked_ingredients' => 'array',
        'favorite_cocktails' => 'array',
        'prefer_alcoholic' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
