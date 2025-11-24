package com.phonecase.auth.service;

import com.phonecase.auth.dto.AuthResponse;
import com.phonecase.auth.dto.LoginRequest;
import com.phonecase.auth.dto.RegisterRequest;
import com.phonecase.auth.entity.User;
import com.phonecase.auth.repository.UserRepository;
import com.phonecase.common.dto.UserDTO;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.common.exception.ConflictException;
import com.phonecase.common.exception.UnauthorizedException;
import com.phonecase.common.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class AuthService {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@(.+)$"
    );
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validate email format
        if (!EMAIL_PATTERN.matcher(request.getEmail()).matches()) {
            throw new BadRequestException("Invalid email format");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists. Please use a different email.");
        }
        
        // Validate password strength
        if (request.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long");
        }
        
        try {
            User user = new User();
            user.setName(sanitizeInput(request.getName()));
            user.setEmail(request.getEmail().toLowerCase().trim());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole("CUSTOMER");
            
            user = userRepository.save(user);
            
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            UserDTO userDTO = convertToDTO(user);
            
            return new AuthResponse(userDTO, token, "Registration successful");
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Email already exists. Please use a different email.");
        }
    }
    
    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        UserDTO userDTO = convertToDTO(user);
        
        return new AuthResponse(userDTO, token, "Login successful");
    }
    
    public AuthResponse adminLogin(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        if (!user.getRole().equals("ADMIN") && !user.getRole().equals("EMPLOYEE")) {
            throw new UnauthorizedException("Access denied. Admin or Employee role required");
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        UserDTO userDTO = convertToDTO(user);
        
        return new AuthResponse(userDTO, token, "Admin login successful");
    }
    
    public boolean validateToken(String token) {
        try {
            return !jwtUtil.isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    private String sanitizeInput(String input) {
        if (input == null) return null;
        // Remove potential XSS characters
        return input.replaceAll("[<>\"']", "").trim();
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}


