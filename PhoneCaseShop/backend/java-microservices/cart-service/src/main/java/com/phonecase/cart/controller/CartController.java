package com.phonecase.cart.controller;

import com.phonecase.cart.dto.CartItemDTO;
import com.phonecase.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(@RequestParam("userId") Long userId) {
        List<CartItemDTO> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }
    
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItemDTO cartItemDTO) {
        try {
            CartItemDTO added = cartService.addToCart(cartItemDTO);
            return ResponseEntity.ok(added);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        try {
            cartService.removeFromCart(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Item removed from cart");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam("userId") Long userId) {
        try {
            cartService.clearCart(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}/quantity")
    public ResponseEntity<?> updateQuantity(@PathVariable("id") Long id, @RequestParam("quantity") Integer quantity) {
        try {
            CartItemDTO updated = cartService.updateQuantity(id, quantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}



