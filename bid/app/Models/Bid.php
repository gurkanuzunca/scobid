<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Bid
 * @package App\Models
 *
 * @property integer $id
 * @property integer $auction_id
 * @property string $username
 * @property integer $price
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 *
 * * @property $auction
 */
class Bid extends Model
{
    use HasFactory;

    protected $fillable = ['price', 'username'];

    public function auction()
    {
        return $this->belongsTo(Auction::class);
    }
}
