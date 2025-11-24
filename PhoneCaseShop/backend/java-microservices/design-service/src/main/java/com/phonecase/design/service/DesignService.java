package com.phonecase.design.service;

import com.phonecase.design.dto.DesignDTO;
import com.phonecase.design.entity.CustomDesign;
import com.phonecase.design.repository.CustomDesignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DesignService {
    
    @Autowired
    private CustomDesignRepository designRepository;
    
    public DesignDTO createDesign(DesignDTO designDTO) {
        CustomDesign design = convertToEntity(designDTO);
        design = designRepository.save(design);
        return convertToDTO(design);
    }
    
    public List<DesignDTO> getDesignsByUserId(Long userId) {
        return designRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public DesignDTO getDesignById(Long id) {
        CustomDesign design = designRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Design not found"));
        return convertToDTO(design);
    }
    
    public void deleteDesign(Long id) {
        designRepository.deleteById(id);
    }
    
    private DesignDTO convertToDTO(CustomDesign design) {
        DesignDTO dto = new DesignDTO();
        dto.setId(design.getId());
        dto.setUserId(design.getUserId());
        dto.setDesignName(design.getDesignName());
        dto.setImageData(design.getImageData());
        dto.setPhoneModel(design.getPhoneModel());
        dto.setCaseType(design.getCaseType());
        dto.setDesignConfig(design.getDesignConfig());
        dto.setCreatedAt(design.getCreatedAt());
        dto.setUpdatedAt(design.getUpdatedAt());
        return dto;
    }
    
    private CustomDesign convertToEntity(DesignDTO dto) {
        CustomDesign design = new CustomDesign();
        design.setUserId(dto.getUserId());
        design.setDesignName(dto.getDesignName());
        design.setImageData(dto.getImageData());
        design.setPhoneModel(dto.getPhoneModel());
        design.setCaseType(dto.getCaseType());
        design.setDesignConfig(dto.getDesignConfig());
        return design;
    }
}



