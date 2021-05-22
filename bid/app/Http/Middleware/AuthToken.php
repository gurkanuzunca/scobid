<?php

namespace App\Http\Middleware;

use App\Exceptions\AuthenticationRequiredException;
use App\Http\Controllers\AuthController;
use Closure;
use Illuminate\Http\Request;

class AuthToken
{
    /**
     * Handle an incoming request.
     *
     * This middleware is checking the simple user's credentials.
     *
     * @param Request $request
     * @param \Closure $next
     * @return mixed
     * @throws \Exception
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->headers->get('x-auth-user');

        if (! isset(AuthController::USERS[$user])) {
            throw new AuthenticationRequiredException();
        }

        $request->merge(['user' => $user]);

        return $next($request);
    }
}
