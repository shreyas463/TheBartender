<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cocktails', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('instructions');
            $table->json('ingredients');
            $table->string('image_url')->nullable();
            $table->string('glass_type')->nullable();
            $table->string('category')->nullable();
            $table->boolean('is_alcoholic')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cocktails');
    }
};
