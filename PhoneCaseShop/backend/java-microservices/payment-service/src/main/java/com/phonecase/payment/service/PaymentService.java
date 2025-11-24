package com.phonecase.payment.service;

import com.phonecase.payment.dto.PaymentDTO;
import com.phonecase.payment.entity.Payment;
import com.phonecase.payment.repository.PaymentRepository;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.common.exception.ConflictException;
import com.phonecase.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    
    private static final int PAYMENT_TIMEOUT_MINUTES = 30;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO) {
        // Check for duplicate payment
        if (paymentRepository.findByOrderId(paymentDTO.getOrderId()).isPresent()) {
            throw new ConflictException("Payment already exists for this order");
        }
        
        // Validate amount
        if (paymentDTO.getAmount() == null || paymentDTO.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payment amount must be greater than 0");
        }
        
        try {
            Payment payment = new Payment();
            payment.setOrderId(paymentDTO.getOrderId());
            payment.setUserId(paymentDTO.getUserId());
            payment.setAmount(paymentDTO.getAmount());
            payment.setPaymentMethod(paymentDTO.getPaymentMethod() != null ? paymentDTO.getPaymentMethod() : "COD");
            payment.setPaymentStatus("PENDING");
            
            payment = paymentRepository.save(payment);
            return convertToDTO(payment);
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("Payment already exists for this order");
        }
    }
    
    @Transactional
    public PaymentDTO processCODPayment(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", orderId));
        
        // Check if payment is already processed
        if ("PAID".equals(payment.getPaymentStatus())) {
            throw new ConflictException("Payment has already been processed");
        }
        
        // Check for timeout (for non-COD payments, but we check anyway)
        if (payment.getCreatedAt() != null) {
            long minutesSinceCreation = java.time.Duration.between(
                payment.getCreatedAt(), LocalDateTime.now()).toMinutes();
            if (minutesSinceCreation > PAYMENT_TIMEOUT_MINUTES && !"COD".equals(payment.getPaymentMethod())) {
                throw new BadRequestException("Payment has timed out. Please create a new payment.");
            }
        }
        
        // For COD, payment is marked as PAID when order is delivered
        payment.setPaymentStatus("PAID");
        payment.setPaymentDate(LocalDateTime.now());
        
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }
    
    @Transactional
    public PaymentDTO refundPayment(Long orderId, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Refund reason is required");
        }
        
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", orderId));
        
        if ("REFUNDED".equals(payment.getPaymentStatus())) {
            throw new ConflictException("Payment has already been refunded");
        }
        
        if (!"PAID".equals(payment.getPaymentStatus())) {
            throw new BadRequestException("Only paid payments can be refunded");
        }
        
        payment.setPaymentStatus("REFUNDED");
        payment = paymentRepository.save(payment);
        return convertToDTO(payment);
    }
    
    public void handlePaymentCallback(Long orderId, String status, String errorMessage) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", orderId));
        
        if ("SUCCESS".equals(status)) {
            if (!"PAID".equals(payment.getPaymentStatus())) {
                payment.setPaymentStatus("PAID");
                payment.setPaymentDate(LocalDateTime.now());
                paymentRepository.save(payment);
            }
        } else if ("FAILED".equals(status)) {
            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment callback failed: " + 
                (errorMessage != null ? errorMessage : "Unknown error"));
        }
    }
    
    public PaymentDTO getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return convertToDTO(payment);
    }
    
    public List<PaymentDTO> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setOrderId(payment.getOrderId());
        dto.setUserId(payment.getUserId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        return dto;
    }
}


