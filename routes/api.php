<?php

use App\Http\Controllers\GraphQLController;
use Illuminate\Support\Facades\Route;

// Simplified route definition without explicit middleware
Route::match(['get', 'post', 'options'], '/graphql', GraphQLController::class);
