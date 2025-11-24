package com.phonecase.design.controller;

import com.phonecase.design.dto.DesignDTO;
import com.phonecase.design.service.DesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/designs")
public class DesignController {
    
    @Autowired
    private DesignService designService;
    
    @PostMapping
    public ResponseEntity<?> createDesign(@RequestBody DesignDTO designDTO) {
        try {
            DesignDTO created = designService.createDesign(designDTO);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<DesignDTO>> getDesigns(@RequestParam("userId") Long userId) {
        List<DesignDTO> designs = designService.getDesignsByUserId(userId);
        return ResponseEntity.ok(designs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getDesignById(@PathVariable("id") Long id) {
        try {
            DesignDTO design = designService.getDesignById(id);
            return ResponseEntity.ok(design);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDesign(@PathVariable("id") Long id) {
        try {
            designService.deleteDesign(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Design deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}



