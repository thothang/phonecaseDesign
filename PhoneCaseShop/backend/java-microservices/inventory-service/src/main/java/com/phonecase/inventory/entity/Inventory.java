package com.phonecase.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", nullable = false, unique = true)
    private Long productId;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "reserved_quantity")
    private Integer reservedQuantity = 0;
    
    @Column(name = "available_quantity")
    private Integer availableQuantity;
    
    @Column(name = "reorder_level")
    private Integer reorderLevel = 10;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
        if (availableQuantity == null) {
            availableQuantity = quantity - reservedQuantity;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
        availableQuantity = quantity - reservedQuantity;
    }
}



