package com.phonecase.common.exception;

public class BadRequestException extends CustomException {
    public BadRequestException(String message) {
        super(message, "BAD_REQUEST", 400);
    }
}


