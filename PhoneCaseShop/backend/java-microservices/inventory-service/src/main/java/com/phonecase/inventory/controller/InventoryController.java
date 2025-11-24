package com.phonecase.inventory.controller;

import com.phonecase.inventory.dto.InventoryDTO;
import com.phonecase.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getInventoryByProductId(@PathVariable("productId") Long productId) {
        try {
            InventoryDTO inventory = inventoryService.getInventoryByProductId(productId);
            return ResponseEntity.ok(inventory);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/admin/inventory")
    public ResponseEntity<List<InventoryDTO>> getAllInventory() {
        List<InventoryDTO> inventory = inventoryService.getAllInventory();
        return ResponseEntity.ok(inventory);
    }
    
    @GetMapping("/admin/inventory/low-stock")
    public ResponseEntity<List<InventoryDTO>> getLowStockItems() {
        List<InventoryDTO> items = inventoryService.getLowStockItems();
        return ResponseEntity.ok(items);
    }
    
    @PutMapping("/admin/inventory/{productId}")
    public ResponseEntity<?> updateInventory(@PathVariable("productId") Long productId, @RequestParam("quantity") Integer quantity) {
        try {
            InventoryDTO updated = inventoryService.updateInventory(productId, quantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/reserve")
    public ResponseEntity<?> reserveQuantity(@RequestParam("productId") Long productId, @RequestParam("quantity") Integer quantity) {
        try {
            InventoryDTO updated = inventoryService.reserveQuantity(productId, quantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/deduct")
    public ResponseEntity<?> deductQuantity(@RequestParam("productId") Long productId, @RequestParam("quantity") Integer quantity) {
        try {
            InventoryDTO updated = inventoryService.deductQuantity(productId, quantity);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/admin/inventory/{productId}")
    public ResponseEntity<?> deleteInventory(@PathVariable("productId") Long productId) {
        try {
            inventoryService.deleteInventory(productId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}



