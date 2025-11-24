package com.phonecase.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {
    private Long id;
    private Long productId;
    private String productName; // Added product name
    private Integer quantity;
    private Integer reservedQuantity;
    private Integer availableQuantity;
    private Integer reorderLevel;
    private LocalDateTime lastUpdated;
}



