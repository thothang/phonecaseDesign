package com.phonecase.auth.dto;

import com.phonecase.common.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private UserDTO user;
    private UserDTO data; // For frontend compatibility
    private String token;
    private String message;
    
    public AuthResponse(UserDTO user, String token, String message) {
        this.user = user;
        this.data = user; // Set data same as user for frontend
        this.token = token;
        this.message = message;
    }
}

