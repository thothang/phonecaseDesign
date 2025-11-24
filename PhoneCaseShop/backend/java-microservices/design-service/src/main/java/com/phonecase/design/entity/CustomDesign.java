package com.phonecase.design.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "custom_designs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomDesign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "design_name")
    private String designName;
    
    @Column(name = "image_data", columnDefinition = "TEXT")
    private String imageData; // Base64 encoded image
    
    @Column(name = "phone_model")
    private String phoneModel;
    
    @Column(name = "case_type")
    private String caseType;
    
    @Column(name = "design_config", columnDefinition = "TEXT")
    private String designConfig; // JSON configuration
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}



