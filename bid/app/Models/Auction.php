<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Class Auction
 * @package App\Models
 *
 * @property integer $id
 * @property string $title
 * @property string $description
 * @property string $image
 * @property integer $open_price
 * @property integer $last_price
 * @property \DateTime $closed_at
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 *
 *  @property $bids
 *  @property $bidOrders
 */
class Auction extends Model
{
    use HasFactory;

    protected $appends = ['image_path'];

    /**
     * @return HasMany
     */
    public function bids(): HasMany
    {
        return $this->hasMany(Bid::class)->orderBy('id','DESC');
    }

    /**
     * @return HasMany
     */
    public function bidOrders(): HasMany
    {
        return $this->hasMany(BidOrder::class);
    }

    /**
     * @return HasOne
     */
    public function autoBid(): HasOne
    {
        return $this->hasOne(BidOrder::class);
    }

    /**
     * @param $query
     * @param $searchTerm
     * @return mixed
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->where('title', 'LIKE', "%{$searchTerm}%")
            ->orWhere('description', 'LIKE', "%{$searchTerm}%");
    }

    /**
     * @param $query
     * @return mixed
     * @throws \Exception
     */
    public function scopeAvailable($query)
    {
        return $query->where('closed_at', '>', new \DateTime());
    }

    /**
     * @return string
     */
    public function getImagePathAttribute()
    {
        return url("images/{$this->image}");
    }
}
