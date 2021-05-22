<?php

namespace App\Exceptions;

use Throwable;

class AuthenticationRequiredException extends \Exception
{
    public function __construct($message = 'Authentication Required.', $code = 401, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
