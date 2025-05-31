<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_name',
        'name',
        'price',
        'current_stock',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];



}
