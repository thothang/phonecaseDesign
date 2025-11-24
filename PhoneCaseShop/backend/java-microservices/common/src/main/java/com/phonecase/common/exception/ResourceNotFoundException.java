package com.phonecase.common.exception;

public class ResourceNotFoundException extends CustomException {
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s with id %d not found", resource, id), 
              "RESOURCE_NOT_FOUND", 404);
    }
    
    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND", 404);
    }
}


