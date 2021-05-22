<?php

use App\Http\Controllers\AuctionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth.token')->group(function () {
    Route::prefix('/auction')->group(function () {
        Route::get('/index', [AuctionController::class, 'index']);
        Route::get('/detail/{auction}', [AuctionController::class, 'detail']);
    });

    Route::post('/bid/{auction}', [BidController::class, 'makeBid']);
    Route::post('/auto-bid/{auction}', [BidController::class, 'activateAutoBid']);

    Route::get('/setting', [SettingController::class, 'setting']);
    Route::post('/setting/update', [SettingController::class, 'update']);
});

