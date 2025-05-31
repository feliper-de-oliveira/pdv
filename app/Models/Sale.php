<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total',
        'cash_received',
        'change',
    ];

    protected $with = [
        'items',
        'user',
    ];

    public function items() : HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
