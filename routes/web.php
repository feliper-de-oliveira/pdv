<?php

use App\Http\Controllers\Pos\PosController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Sale\SaleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('pos', [PosController::class, 'index'] )->name('pos');

    Route::get('inventory', [ProductController::class, 'index'])->name('inventory');

    Route::post('products/create', [ProductController::class, 'store'])->name('products.create');

    Route::post('sales', [SaleController::class, 'store'])->name('sales.store');

    Route::get('sales-history', [SaleController::class, 'index'])->name('sales-history');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
