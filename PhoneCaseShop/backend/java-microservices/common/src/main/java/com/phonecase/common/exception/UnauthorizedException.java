package com.phonecase.common.exception;

public class UnauthorizedException extends CustomException {
    public UnauthorizedException(String message) {
        super(message, "UNAUTHORIZED", 401);
    }
}


