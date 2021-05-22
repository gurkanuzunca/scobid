<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Setting
 * @package App\Models
 *
 * @property integer $id
 * @property string $username
 * @property integer $max_amount
 */
class Setting extends Model
{
    use HasFactory;
}
