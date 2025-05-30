<?php

namespace App\Http\Controllers\Pos;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class PosController
{
    public function index() : Response
    {
        $products = Product::all();

        return Inertia::render('pos', [
            'products' => $products,
        ]);
    }
}
