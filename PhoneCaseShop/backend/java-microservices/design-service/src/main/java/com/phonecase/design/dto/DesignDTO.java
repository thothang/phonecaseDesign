package com.phonecase.design.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesignDTO {
    private Long id;
    private Long userId;
    private String designName;
    private String imageData;
    private String phoneModel;
    private String caseType;
    private String designConfig;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



