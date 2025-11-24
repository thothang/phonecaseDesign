package com.phonecase.order.controller;

import com.phonecase.order.dto.OrderDTO;
import com.phonecase.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO created = orderService.createOrder(orderDTO);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrders(@RequestParam("userId") Long userId) {
        List<OrderDTO> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable("id") Long id) {
        try {
            OrderDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<?> trackOrder(@PathVariable("orderNumber") String orderNumber) {
        try {
            OrderDTO order = orderService.getOrderByOrderNumber(orderNumber);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/admin/orders/status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable("status") String status) {
        List<OrderDTO> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/admin/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") String status,
            @RequestParam(value = "reason", required = false) String reason) {
        try {
            OrderDTO updated = orderService.updateOrderStatus(id, status, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/admin/orders/{id}/process")
    public ResponseEntity<?> processOrder(@PathVariable("id") Long id) {
        try {
            OrderDTO updated = orderService.processOrder(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/admin/orders/{id}/ship")
    public ResponseEntity<?> shipOrder(@PathVariable("id") Long id) {
        try {
            OrderDTO updated = orderService.shipOrder(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/admin/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable("id") Long id, @RequestParam("reason") String reason) {
        try {
            OrderDTO updated = orderService.cancelOrder(id, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/admin/orders/{id}/return")
    public ResponseEntity<?> returnOrder(@PathVariable("id") Long id, @RequestParam("reason") String reason) {
        try {
            OrderDTO updated = orderService.returnOrder(id, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}



