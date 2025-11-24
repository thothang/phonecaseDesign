package com.phonecase.product.service;

import com.phonecase.product.dto.ProductDTO;
import com.phonecase.product.entity.Product;
import com.phonecase.product.repository.ProductRepository;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findByIsActiveTrue();
        if (products.isEmpty()) {
            throw new BadRequestException("No products available");
        }
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getAllProductsForAdmin() {
        // Filter out custom case products (category = 'custom' or name contains 'custom')
        // Also filter out inactive products (isActive = false)
        List<Product> products = productRepository.findAll().stream()
                .filter(p -> {
                    // Only include active products
                    if (!p.getIsActive()) {
                        return false;
                    }
                    String category = p.getCategory();
                    String name = p.getName() != null ? p.getName().toLowerCase() : "";
                    // Exclude products with category 'custom' or name containing 'custom'
                    return !"custom".equalsIgnoreCase(category) && 
                           !name.contains("custom") && 
                           !name.contains("Custom");
                })
                .collect(Collectors.toList());
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Page<ProductDTO> getAllProductsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::convertToDTO);
    }
    
    public List<ProductDTO> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new BadRequestException("Search keyword is required");
        }
        
        List<Product> products = productRepository.searchProducts(keyword.trim());
        if (products.isEmpty()) {
            throw new BadRequestException("No products found matching: " + keyword);
        }
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ProductDTO getProductById(Long id) {
        if (id == null) {
            throw new BadRequestException("Product ID is required");
        }
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        
        if (!product.getIsActive()) {
            throw new BadRequestException("Product is not available");
        }
        
        return convertToDTO(product);
    }
    
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        validateProductDTO(productDTO);
        validateImageUrl(productDTO.getImageUrl());
        
        Product product = convertToEntity(productDTO);
        product = productRepository.save(product);
        return convertToDTO(product);
    }
    
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        if (id == null) {
            throw new BadRequestException("Product ID is required");
        }
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        
        validateProductDTO(productDTO);
        if (productDTO.getImageUrl() != null) {
            validateImageUrl(productDTO.getImageUrl());
        }
        
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(productDTO.getCategory());
        product.setBrand(productDTO.getBrand());
        product.setModel(productDTO.getModel());
        product.setColor(productDTO.getColor());
        product.setMaterial(productDTO.getMaterial());
        product.setImageUrl(productDTO.getImageUrl());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setIsActive(productDTO.getIsActive());
        
        product = productRepository.save(product);
        return convertToDTO(product);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        if (id == null) {
            throw new BadRequestException("Product ID is required");
        }
        
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        
        // Set product as inactive (soft delete)
        product.setIsActive(false);
        product.setUpdatedAt(java.time.LocalDateTime.now());
        
        try {
            product = productRepository.save(product);
            
            // Verify the product was saved correctly
            if (product.getIsActive() != null && product.getIsActive()) {
                throw new RuntimeException("Failed to deactivate product. Product is still active after deletion.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product: " + e.getMessage(), e);
        }
    }
    
    public boolean productExists(Long id) {
        return productRepository.findById(id)
                .map(Product::getIsActive)
                .orElse(false);
    }
    
    private void validateProductDTO(ProductDTO dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Product name is required");
        }
        if (dto.getPrice() == null || dto.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Product price must be greater than 0");
        }
        if (dto.getStockQuantity() != null && dto.getStockQuantity() < 0) {
            throw new BadRequestException("Stock quantity cannot be negative");
        }
    }
    
    private void validateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            return; // Image URL is optional
        }
        
        try {
            URL url = new URL(imageUrl);
            String protocol = url.getProtocol();
            if (!protocol.equals("http") && !protocol.equals("https")) {
                throw new BadRequestException("Image URL must use http or https protocol");
            }
        } catch (MalformedURLException e) {
            throw new BadRequestException("Invalid image URL format: " + imageUrl);
        }
    }
    
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setBrand(product.getBrand());
        dto.setModel(product.getModel());
        dto.setColor(product.getColor());
        dto.setMaterial(product.getMaterial());
        dto.setImageUrl(product.getImageUrl());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }
    
    private Product convertToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setBrand(dto.getBrand());
        product.setModel(dto.getModel());
        product.setColor(dto.getColor());
        product.setMaterial(dto.getMaterial());
        product.setImageUrl(dto.getImageUrl());
        product.setStockQuantity(dto.getStockQuantity());
        product.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        return product;
    }
}


