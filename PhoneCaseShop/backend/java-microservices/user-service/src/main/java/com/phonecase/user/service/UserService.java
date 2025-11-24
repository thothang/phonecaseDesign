package com.phonecase.user.service;

import com.phonecase.common.dto.UserDTO;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.user.entity.User;
import com.phonecase.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }
    
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(userDTO.getName());
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        
        user = userRepository.save(user);
        return convertToDTO(user);
    }
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getUsersByRole(String role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user has orders
        try {
            Long orderCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM orders WHERE user_id = ?", 
                Long.class, 
                id
            );
            
            if (orderCount != null && orderCount > 0) {
                throw new BadRequestException(
                    String.format("Cannot delete user. User has %d order(s). Please delete or reassign orders first.", orderCount)
                );
            }
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            // No orders found, continue
        }
        
        // Check if user has payments
        try {
            Long paymentCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM payments WHERE user_id = ?", 
                Long.class, 
                id
            );
            
            if (paymentCount != null && paymentCount > 0) {
                throw new BadRequestException(
                    String.format("Cannot delete user. User has %d payment(s). Please delete or reassign payments first.", paymentCount)
                );
            }
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            // No payments found, continue
        }
        
        // Delete related records first
        try {
            // Delete cart items
            jdbcTemplate.update("DELETE FROM cart_items WHERE user_id = ?", id);
            
            // Delete custom designs
            jdbcTemplate.update("DELETE FROM custom_designs WHERE user_id = ?", id);
            
            // Now delete the user
            userRepository.delete(user);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException(
                "Cannot delete user. User has related records that cannot be deleted. Error: " + e.getMessage()
            );
        }
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



