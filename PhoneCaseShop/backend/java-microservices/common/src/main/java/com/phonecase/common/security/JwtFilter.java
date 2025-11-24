package com.phonecase.common.security;

import com.phonecase.common.exception.UnauthorizedException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip JWT validation for public endpoints
        // Note: Paths may come from API Gateway (with /api prefix stripped) or directly
        // Normalize path by removing query string and trailing slashes
        String normalizedPath = path.split("\\?")[0].replaceAll("/+$", "");
        
        // Public endpoints that don't require authentication
        boolean isPublicEndpoint = 
            // Auth endpoints
            normalizedPath.startsWith("/login") || 
            normalizedPath.startsWith("/register") || 
            normalizedPath.startsWith("/auth/") ||
            normalizedPath.equals("/admin/login") ||
            normalizedPath.equals("/admin/check-auth") || 
            // Product public endpoints - GET requests to view products (not admin endpoints)
            // Note: API Gateway rewrites /api/products/{path} to /products/{path}
            (method.equals("GET") && (
                normalizedPath.equals("/products") ||
                (normalizedPath.startsWith("/products/") && !normalizedPath.contains("/admin")) ||
                // After API Gateway rewrite: /products/all, /products/search, /products/{id}
                normalizedPath.equals("/products/all") ||
                normalizedPath.startsWith("/products/all/") ||
                normalizedPath.startsWith("/products/search") ||
                // Numeric ID pattern after /products/ (e.g., /products/1, /products/2)
                normalizedPath.matches("/products/\\d+")
            )) ||
            (method.equals("GET") && (
                normalizedPath.equals("/api/products") ||
                normalizedPath.startsWith("/api/products/") && !normalizedPath.contains("/admin")
            )) ||
            // Health check and actuator endpoints
            normalizedPath.startsWith("/actuator") || 
            normalizedPath.equals("/health");
        
        if (isPublicEndpoint) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing or invalid authorization header");
        }
        
        String token = authHeader.substring(7);
        
        try {
            if (jwtUtil.isTokenExpired(token)) {
                throw new UnauthorizedException("Token has expired");
            }
            
            String email = jwtUtil.getEmailFromToken(token);
            // You can add user to request attributes here if needed
            request.setAttribute("userEmail", email);
            request.setAttribute("userRole", jwtUtil.getRoleFromToken(token));
            
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid token: " + e.getMessage());
        }
        
        filterChain.doFilter(request, response);
    }
}


