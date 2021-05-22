<?php

namespace App\Http\Controllers;

use App\Http\Requests\SettingRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function setting(): JsonResponse
    {
        $setting = Setting::where('username', $this->getUser())->first();

        return response()->json([
            'code' => 200,
            'data' => $setting,
        ]);
    }

    /**
     * @param SettingRequest $request
     * @return JsonResponse
     */
    public function update(SettingRequest $request): JsonResponse
    {
        /** @var Setting $setting */
        $setting = Setting::where('username', $this->getUser())->first();

        if (!$setting) {
            $setting = new Setting();
            $setting->username = $this->getUser();
        }

        $setting->max_amount = $request->get('maxAmount');
        $setting->save();

        return response()->json([
            'code' => 200,
            'data' => $setting,
        ]);
    }
}
