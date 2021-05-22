<?php

namespace App\Listeners;

use App\Events\AutoBidEvent;
use App\Models\Bid;
use App\Models\BidOrder;
use Illuminate\Support\Facades\DB;

class AutoBidListener
{
    /**
     * Handle the event.
     *
     * @param  AutoBidEvent $event
     * @return void
     */
    public function handle(AutoBidEvent $event)
    {
        $bidOrderQuery = $event->auction->bidOrders()
            ->with('auction','setting')
            ->orderBy('id', 'ASC');

        /**
         * Get auction bidders.
         */
        $usernames = $bidOrderQuery->get()->pluck('username')->toArray();

        /**
         * Total bid amounts of bidders.
         */
        $bidAmounts =  DB::table('bids', 'bid')
            ->selectRaw('bid.username, SUM(bid.price) as amount')
            ->leftJoin('bids AS bid2', function ($join) {
                $join->on('bid.username', '=', 'bid2.username')
                    ->on('bid.auction_id', '=', 'bid2.auction_id')
                    ->on('bid.id', '<', 'bid2.id');
            })
            ->whereNull('bid2.id')
            ->whereIn('bid.username', $usernames)
            ->groupBy('bid.username')
            ->get()
            ->keyBy('username')
            ->toArray();

        /**
         * Last bids of bidders.
         */
        $lastBids =  DB::table('bids', 'bid')
            ->selectRaw('bid.username, bid.price')
            ->leftJoin('bids AS bid2', function ($join) {
                $join->on('bid.username', '=', 'bid2.username')
                    ->on('bid.auction_id', '=', 'bid2.auction_id')
                    ->on('bid.id', '<', 'bid2.id');
            })
            ->whereNull('bid2.id')
            ->whereIn('bid.username', $usernames)
            ->get()
            ->keyBy('username')
            ->toArray();


        /** @var BidOrder $bidOrder */
        foreach ($bidOrderQuery->get() as $bidOrder) {
            $userInfo = $this->getUserInfo($bidAmounts, $lastBids, $bidOrder);
            $amount = $userInfo->userTotalBidAmount - $userInfo->userAuctionLastBid + $event->auction->last_price;
            $maxAmount = optional($bidOrder->setting)->max_amount;

            if (
                ($bidOrder->username === \request('user')) || ($maxAmount < 1) ||
                ($userInfo->userTotalBidAmount >= $maxAmount) ||
                ($amount >= $maxAmount)
            ) {
                continue;
            }

            $bid = new Bid();
            $bid->auction_id = $bidOrder->auction_id;
            $bid->username = $bidOrder->username;
            $bid->price = $event->auction->last_price + 1;
            $bid->save();

            $event->auction->last_price = $bid->price;
            $event->auction->save();
        }
    }

    /**
     * @param array $bidAmounts
     * @param array $lastBids
     * @param BidOrder $bidOrder
     * @return object
     */
    private function getUserInfo(array $bidAmounts, array $lastBids, BidOrder $bidOrder): object
    {
        return (object) [
            'userTotalBidAmount' => isset($bidAmounts[$bidOrder->username])
                ? optional($bidAmounts[$bidOrder->username])->amount
                : 0,
            'userAuctionLastBid' => isset($lastBids[$bidOrder->username])
                ? optional($lastBids[$bidOrder->username])->price
                : 0,
        ];
    }
}
