<?php

namespace App\Http\Controllers\Product;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController
{


    public function index() : Response
    {
        $products = Product::all();

        return Inertia::render('inventory', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        Product::create([
            'category_name' => $request->input('category_name'),
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'current_stock' => $request->input('current_stock'),
            'is_active' => $request->input('is_active', true),
        ]);

        return redirect()->back()->with('success', 'Product created successfully.');
    }


}
