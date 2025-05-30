<?php

namespace App\Http\Controllers\Sale;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
class SaleController
{
    public function index()
    {
        $sales = Sale::all();

        $salesFormatted = $sales->map(function ($sale) {
            return [
                'id' => $sale->id,
                'date' => $sale->created_at->toIso8601String(),
                'items' => $sale->items->sum('quantity'),
                'total' => (float) $sale->total,
                'paymentMethod' => 'Cash',
                'cashier' => $sale->user ? $sale->user->name : null,
            ];
        });

        $saleDetails = [];
        foreach ($sales as $sale) {
            foreach ($sale->items as $item) {

                $saleDetails[] = [
                    'saleId' => $sale->id,
                    'productName' => $item->product->name ?? null,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) ($item->price * $item->quantity),
                ];
            }
        }


        return Inertia::render('sales-history', [
            'sales' => $salesFormatted,
            'saleDetail' => $saleDetails,
        ]);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'cash_received' => 'required|numeric|min:0',
            'change' => 'required|numeric',
        ]);

        $sale = Sale::create([
            'user_id' => auth()->id(),
            'total' => $data['total'],
            'cash_received' => $data['cash_received'],
            'change' => $data['change'],
        ]);

        foreach ($data['items'] as $item) {
            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);

            Product::where('id', $item['product_id'])->decrement('current_stock', $item['quantity']);
        }

        return redirect()->route('pos')->with('success', 'Venda registrada com sucesso!');
    }
}
