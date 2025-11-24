package com.phonecase.inventory.service;

import com.phonecase.inventory.dto.InventoryDTO;
import com.phonecase.inventory.entity.Inventory;
import com.phonecase.inventory.repository.InventoryRepository;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DeadlockLoserDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    
    @Autowired
    private InventoryRepository inventoryRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public InventoryDTO getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", productId));
        return convertToDTO(inventory);
    }
    
    public List<InventoryDTO> getAllInventory() {
        // Use JdbcTemplate to join with products table and get product name
        String sql = "SELECT i.id, i.product_id, p.name as product_name, i.quantity, " +
                     "i.reserved_quantity, i.available_quantity, i.reorder_level, i.last_updated " +
                     "FROM inventory i " +
                     "LEFT JOIN products p ON i.product_id = p.id " +
                     "ORDER BY i.id";
        
        return jdbcTemplate.query(sql, new InventoryDTORowMapper());
    }
    
    private static class InventoryDTORowMapper implements RowMapper<InventoryDTO> {
        @Override
        public InventoryDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            InventoryDTO dto = new InventoryDTO();
            dto.setId(rs.getLong("id"));
            dto.setProductId(rs.getLong("product_id"));
            dto.setProductName(rs.getString("product_name")); // Can be null if product doesn't exist
            dto.setQuantity(rs.getInt("quantity"));
            dto.setReservedQuantity(rs.getInt("reserved_quantity"));
            dto.setAvailableQuantity(rs.getInt("available_quantity"));
            dto.setReorderLevel(rs.getInt("reorder_level"));
            java.sql.Timestamp timestamp = rs.getTimestamp("last_updated");
            if (timestamp != null) {
                dto.setLastUpdated(timestamp.toLocalDateTime());
            }
            return dto;
        }
    }
    
    public List<InventoryDTO> getLowStockItems() {
        return inventoryRepository.findAll().stream()
                .filter(inv -> inv.getAvailableQuantity() < inv.getReorderLevel())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public InventoryDTO updateInventory(Long productId, Integer quantity) {
        if (quantity == null || quantity < 0) {
            throw new BadRequestException("Quantity must be non-negative");
        }
        
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElse(new Inventory());
        
        if (inventory.getId() == null) {
            inventory.setProductId(productId);
        }
        
        inventory.setQuantity(quantity);
        inventory = inventoryRepository.save(inventory);
        return convertToDTO(inventory);
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Retryable(value = DeadlockLoserDataAccessException.class, maxAttempts = 3, backoff = @Backoff(delay = 100))
    public InventoryDTO reserveQuantity(Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        
        // Use pessimistic locking to prevent double spending
        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", productId));
        
        if (inventory.getAvailableQuantity() < quantity) {
            throw new BadRequestException(
                String.format("Insufficient stock. Available: %d, Requested: %d",
                    inventory.getAvailableQuantity(), quantity)
            );
        }
        
        inventory.setReservedQuantity(inventory.getReservedQuantity() + quantity);
        inventory = inventoryRepository.save(inventory);
        return convertToDTO(inventory);
    }
    
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public InventoryDTO releaseReservedQuantity(Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", productId));
        
        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
        inventory = inventoryRepository.save(inventory);
        return convertToDTO(inventory);
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    @Retryable(value = DeadlockLoserDataAccessException.class, maxAttempts = 3, backoff = @Backoff(delay = 100))
    public InventoryDTO deductQuantity(Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        
        // Use pessimistic locking to prevent double spending
        Inventory inventory = inventoryRepository.findByProductIdWithLock(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", productId));
        
        if (inventory.getAvailableQuantity() < quantity) {
            throw new BadRequestException(
                String.format("Insufficient stock. Available: %d, Requested: %d",
                    inventory.getAvailableQuantity(), quantity)
            );
        }
        
        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
        inventory = inventoryRepository.save(inventory);
        return convertToDTO(inventory);
    }
    
    public boolean checkStockAvailability(Long productId, Integer quantity) {
        return inventoryRepository.findByProductId(productId)
                .map(inv -> inv.getAvailableQuantity() >= quantity)
                .orElse(false);
    }
    
    public void deleteInventory(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", productId));
        inventoryRepository.delete(inventory);
    }
      
      private InventoryDTO convertToDTO(Inventory inventory) {
        InventoryDTO dto = new InventoryDTO();
        dto.setId(inventory.getId());
        dto.setProductId(inventory.getProductId());
        dto.setProductName(null); // Will be set when using getAllInventory with JOIN
        dto.setQuantity(inventory.getQuantity());
        dto.setReservedQuantity(inventory.getReservedQuantity());
        dto.setAvailableQuantity(inventory.getAvailableQuantity());
        dto.setReorderLevel(inventory.getReorderLevel());
        dto.setLastUpdated(inventory.getLastUpdated());
        return dto;
    }
}


