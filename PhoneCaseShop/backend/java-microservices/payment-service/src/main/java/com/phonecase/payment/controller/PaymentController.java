package com.phonecase.payment.controller;

import com.phonecase.payment.dto.PaymentDTO;
import com.phonecase.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<?> createPayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            PaymentDTO created = paymentService.createPayment(paymentDTO);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/cod/{orderId}")
    public ResponseEntity<?> processCODPayment(@PathVariable("orderId") Long orderId) {
        try {
            PaymentDTO payment = paymentService.processCODPayment(orderId);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/refund/{orderId}")
    public ResponseEntity<?> refundPayment(@PathVariable("orderId") Long orderId, @RequestParam("reason") String reason) {
        try {
            PaymentDTO payment = paymentService.refundPayment(orderId, reason);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable("orderId") Long orderId) {
        try {
            PaymentDTO payment = paymentService.getPaymentByOrderId(orderId);
            return ResponseEntity.ok(payment);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByUserId(@PathVariable("userId") Long userId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByUserId(userId);
        return ResponseEntity.ok(payments);
    }
}



