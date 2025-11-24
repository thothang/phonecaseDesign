package com.phonecase.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String status;
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String shippingPhone;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime shippingDate;
    private LocalDateTime deliveryDate;
    private String cancellationReason;
    private String returnReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemDTO> items;
}



