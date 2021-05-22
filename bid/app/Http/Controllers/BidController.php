<?php

namespace App\Http\Controllers;

use App\Events\AutoBidEvent;
use App\Http\Requests\AutoBidRequest;
use App\Http\Requests\BidRequest;
use App\Models\Auction;
use App\Models\BidOrder;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class BidController extends Controller
{
    /**
     * @param BidRequest $request
     * @param Auction $auction
     * @return JsonResponse
     * @throws \Exception
     */
    public function makeBid(BidRequest $request, Auction $auction): JsonResponse
    {
        $price = $request->get('price');
        $auction->load('bids');
        $auction->refresh();

        if ($auction->closed_at > new \DateTime()) {
            return response()->json([
                'code' => 404,
                'message' => 'This auction has been closed!',
                'data' => $auction,
            ]);
        }

        if ($auction->last_price >= $price) {
            return response()->json([
                'code' => 406,
                'message' => 'The price cannot be lower than the last bid!',
                'data' => $auction,
            ]);
        }

        $lastBid = $auction->bids()->latest();

        if ($lastBid->first() && optional($lastBid->first())->username === $this->getUser()) {
            return response()->json([
                'code' => 406,
                'message' => 'You already have made the highest bid!',
                'data' => $auction,
            ]);
        }

        $auction->bids()->create([
            'price' => $price,
            'username' => $this->getUser(),
        ]);

        $auction->last_price = $price;
        $auction->save();

        AutoBidEvent::dispatch($auction);
        $auction->refresh();

        return response()->json([
            'code' => 200,
            'data' => $auction
        ]);
    }

    /**
     * @param AutoBidRequest $request
     * @param Auction $auction
     * @return JsonResponse
     */
    public function activateAutoBid(AutoBidRequest $request, Auction $auction): JsonResponse
    {
        /** @var BidOrder $bidOrder */
        $bidOrder = BidOrder::query()
            ->where('username', $this->getUser())
            ->where('auction_id', $auction->id)
            ->first();

        if ($request->get('status') === true) {
            if (! $bidOrder) {
                $bidOrder = new BidOrder();
                $bidOrder->auction_id = $auction->id;
                $bidOrder->username = $this->getUser();
                $bidOrder->save();
            }

            return response()->json([
                'code' => 200,
                'message' => 'Auto-bid has been activated',
                'data' => null,
            ]);
        } elseif ($bidOrder) {
            $bidOrder->delete();
        }

        return response()->json([
            'code' => 200,
            'message' => 'Auto-bid has been deactivated',
            'data' => null,
        ]);
    }
}
