<?php

namespace App\Http\Controllers;

use App\Exceptions\AuthenticationRequiredException;
use App\Http\Requests\AuthRequest;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    const USERS = [
        'user1' => ['username' => 'user1', 'password' => 'user1pass'],
        'user2' => ['username' => 'user2', 'password' => 'user2pass']
    ];

    /**
     * @param AuthRequest $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function login(AuthRequest $request): JsonResponse
    {
        if (! $request->has('username') || !$request->has('password')) {
            throw new AuthenticationRequiredException();
        }

        $username = $request->get('username');
        $password = $request->get('password');

        if (! isset(AuthController::USERS[$username])) {
            throw new AuthenticationRequiredException();
        }

        if (AuthController::USERS[$username]['password'] !== $password) {
            throw new AuthenticationRequiredException();
        }

        return response()->json([
            'code' => 200,
            'data' => [
                'user' => $username
            ]
        ]);
    }
}
