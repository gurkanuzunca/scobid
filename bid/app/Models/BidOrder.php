<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class BidOrder
 * @package App\Models
 *
 * @property integer $id
 * @property integer $auction_id
 * @property string $username
 * @property boolean $status
 *
 * @property $auction
 * @property $setting
 */
class BidOrder extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo
     */
    public function auction(): BelongsTo
    {
        return $this->belongsTo(Auction::class);
    }

    /**
     * @return BelongsTo
     */
    public function setting(): BelongsTo
    {
        return $this->belongsTo(Setting::class, 'username', 'username');
    }
}
