package com.phonecase.common.exception;

public class ConflictException extends CustomException {
    public ConflictException(String message) {
        super(message, "CONFLICT", 409);
    }
}


