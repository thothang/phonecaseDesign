package com.phonecase.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String errorCode;
    private String message;
    private int statusCode;
    private LocalDateTime timestamp;
    private Map<String, String> details;

    public ErrorResponse(String errorCode, String message, int statusCode) {
        this.errorCode = errorCode;
        this.message = message;
        this.statusCode = statusCode;
        this.timestamp = LocalDateTime.now();
    }
    
    // Explicit setter for details to ensure it's available
    public void setDetails(Map<String, String> details) {
        this.details = details;
    }
}

