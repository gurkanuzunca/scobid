<?php

namespace App\Http\Controllers;

use App\Exceptions\NotFoundException;
use App\Models\Auction;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuctionController extends Controller
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $auctions = Auction::available()
            ->when($request->has('searchTerm'), function ($query) use ($request) {
                return $query->search($request->get('searchTerm'));
            })
            ->when($request->has('sort'), function ($query) use ($request) {
                return $query->orderBy('open_price', $request->get('sort') === 'asc' ? 'asc' : 'desc');
            })
            ->when(!$request->has('sort'), function ($query) use ($request) {
                return $query->orderBy('id', 'DESC');
            })
            ->paginate(8);

        return response()->json([
            'code' => 200,
            'data' => $auctions,
        ]);
    }

    /**
     * @param Auction $auction
     * @return JsonResponse
     * @throws \Exception
     */
    public function detail(Auction $auction): JsonResponse
    {
        $auction->load(['bids', 'autoBid' => function ($query)  {
            $query->where('username', $this->getUser());
        }]);

        if ($auction->closed_at > new \DateTime()) {
            return response()->json([
                'code' => 404,
                'message' => 'This auction has been closed.',
                'data' => null,
                'setting' => null,
            ]);
        }

        $settings = Setting::query()->where('username', $this->getUser())->first();

        return response()->json([
            'code' => 200,
            'data' => $auction,
            'settings' => $settings
        ]);
    }
}
