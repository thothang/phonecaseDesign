package com.phonecase.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long orderId;
    private Long productId;
    private Long designId;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}



