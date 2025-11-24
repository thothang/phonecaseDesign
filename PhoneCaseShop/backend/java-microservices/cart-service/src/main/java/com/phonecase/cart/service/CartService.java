package com.phonecase.cart.service;

import com.phonecase.cart.dto.CartItemDTO;
import com.phonecase.cart.entity.CartItem;
import com.phonecase.cart.repository.CartItemRepository;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    public List<CartItemDTO> getCartByUserId(Long userId) {
        List<CartItemDTO> cartItems = cartItemRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        // Return empty list instead of throwing exception
        return cartItems;
    }
    
    @Transactional
    public CartItemDTO addToCart(CartItemDTO cartItemDTO) {
        // Validate input
        if (cartItemDTO.getUserId() == null) {
            throw new BadRequestException("User ID is required");
        }
        if (cartItemDTO.getProductId() == null && cartItemDTO.getDesignId() == null) {
            throw new BadRequestException("Either product ID or design ID is required");
        }
        if (cartItemDTO.getQuantity() == null || cartItemDTO.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        if (cartItemDTO.getPrice() == null || cartItemDTO.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Price must be greater than 0");
        }
        
        CartItem existingItem = cartItemRepository
                .findByUserIdAndProductIdAndDesignId(
                        cartItemDTO.getUserId(),
                        cartItemDTO.getProductId(),
                        cartItemDTO.getDesignId())
                .orElse(null);
        
        if (existingItem != null) {
            // Check if price has changed
            if (existingItem.getPrice().compareTo(cartItemDTO.getPrice()) != 0) {
                throw new BadRequestException(
                    String.format("Product price has changed from %s to %s. Please refresh your cart.",
                        existingItem.getPrice(), cartItemDTO.getPrice())
                );
            }
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDTO.getQuantity());
            existingItem = cartItemRepository.save(existingItem);
            return convertToDTO(existingItem);
        } else {
            CartItem cartItem = convertToEntity(cartItemDTO);
            cartItem = cartItemRepository.save(cartItem);
            return convertToDTO(cartItem);
        }
    }
    
    @Transactional
    public void removeFromCart(Long cartItemId) {
        if (!cartItemRepository.existsById(cartItemId)) {
            throw new ResourceNotFoundException("Cart item", cartItemId);
        }
        cartItemRepository.deleteById(cartItemId);
    }
    
    @Transactional
    public void clearCart(Long userId) {
        if (userId == null) {
            throw new BadRequestException("User ID is required");
        }
        cartItemRepository.deleteByUserId(userId);
    }
    
    @Transactional
    public CartItemDTO updateQuantity(Long cartItemId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));
        
        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);
        return convertToDTO(cartItem);
    }
    
    public void validateCartNotEmpty(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        if (items.isEmpty()) {
            throw new BadRequestException("Cart is empty. Please add items before checkout.");
        }
    }
    
    private CartItemDTO convertToDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setUserId(cartItem.getUserId());
        dto.setProductId(cartItem.getProductId());
        dto.setDesignId(cartItem.getDesignId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPrice(cartItem.getPrice());
        dto.setCreatedAt(cartItem.getCreatedAt());
        dto.setUpdatedAt(cartItem.getUpdatedAt());
        return dto;
    }
    
    private CartItem convertToEntity(CartItemDTO dto) {
        CartItem cartItem = new CartItem();
        cartItem.setUserId(dto.getUserId());
        cartItem.setProductId(dto.getProductId());
        cartItem.setDesignId(dto.getDesignId());
        cartItem.setQuantity(dto.getQuantity());
        cartItem.setPrice(dto.getPrice());
        return cartItem;
    }
}


