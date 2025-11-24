package com.phonecase.order.service;

import com.phonecase.order.dto.OrderDTO;
import com.phonecase.order.dto.OrderItemDTO;
import com.phonecase.order.entity.Order;
import com.phonecase.order.entity.OrderItem;
import com.phonecase.order.repository.OrderItemRepository;
import com.phonecase.order.repository.OrderRepository;
import com.phonecase.common.exception.BadRequestException;
import com.phonecase.common.exception.ConflictException;
import com.phonecase.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {
    
    private static final Set<String> VALID_STATUSES = Set.of(
        "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"
    );
    
    private static final Set<String> FINAL_STATUSES = Set.of("DELIVERED", "CANCELLED", "RETURNED");
    
    // Valid status transitions
    private static final Set<String> PENDING_TRANSITIONS = Set.of("PROCESSING", "CANCELLED", "DELIVERED");
    private static final Set<String> PROCESSING_TRANSITIONS = Set.of("SHIPPED", "CANCELLED", "DELIVERED");
    private static final Set<String> SHIPPED_TRANSITIONS = Set.of("DELIVERED", "RETURNED");
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // Validate order data
        if (orderDTO.getUserId() == null) {
            throw new BadRequestException("User ID is required");
        }
        if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }
        if (orderDTO.getTotalAmount() == null || orderDTO.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Total amount must be greater than 0");
        }
        if (orderDTO.getShippingAddress() == null || orderDTO.getShippingAddress().trim().isEmpty()) {
            throw new BadRequestException("Shipping address is required");
        }
        if (orderDTO.getShippingPhone() == null || orderDTO.getShippingPhone().trim().isEmpty()) {
            throw new BadRequestException("Shipping phone is required");
        }
        
        // Generate unique order number
        String orderNumber = generateUniqueOrderNumber();
        
        try {
            Order order = convertToEntity(orderDTO);
            order.setOrderNumber(orderNumber);
            order.setStatus("PENDING");
            order.setPaymentStatus("PENDING");
            order = orderRepository.save(order);
            
            // Save order items
            for (OrderItemDTO itemDTO : orderDTO.getItems()) {
                if (itemDTO.getProductId() == null && itemDTO.getDesignId() == null) {
                    throw new BadRequestException("Order item must have either product ID or design ID");
                }
                if (itemDTO.getQuantity() == null || itemDTO.getQuantity() <= 0) {
                    throw new BadRequestException("Order item quantity must be greater than 0");
                }
                
                OrderItem item = new OrderItem();
                item.setOrderId(order.getId());
                item.setProductId(itemDTO.getProductId());
                item.setDesignId(itemDTO.getDesignId());
                item.setQuantity(itemDTO.getQuantity());
                item.setPrice(itemDTO.getPrice());
                item.setSubtotal(itemDTO.getPrice().multiply(java.math.BigDecimal.valueOf(itemDTO.getQuantity())));
                orderItemRepository.save(item);
            }
            
            return convertToDTO(order);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("UNIQUE") || e.getMessage().contains("order_number")) {
                // Retry with new order number if duplicate
                return createOrder(orderDTO);
            }
            throw new ConflictException("Failed to create order: " + e.getMessage());
        }
    }
    
    private String generateUniqueOrderNumber() {
        String baseNumber = "ORD" + System.currentTimeMillis();
        // Check if exists, if yes, add random suffix
        if (orderRepository.findByOrderNumber(baseNumber).isPresent()) {
            baseNumber += "-" + (int)(Math.random() * 1000);
        }
        return baseNumber;
    }
    
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        return convertToDTO(order);
    }
    
    public OrderDTO getOrderByOrderNumber(String orderNumber) {
        if (orderNumber == null || orderNumber.trim().isEmpty()) {
            throw new BadRequestException("Order number is required");
        }
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order with number " + orderNumber));
        return convertToDTO(order);
    }
    
    public List<OrderDTO> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            if (orders == null || orders.isEmpty()) {
                return new java.util.ArrayList<>();
            }
            return orders.stream()
                    .map(order -> {
                        try {
                            return convertToDTO(order);
                        } catch (Exception e) {
                            // Log error for individual order conversion
                            // Return a minimal DTO if conversion fails
                            OrderDTO dto = new OrderDTO();
                            dto.setId(order.getId());
                            dto.setOrderNumber(order.getOrderNumber());
                            dto.setUserId(order.getUserId());
                            dto.setStatus(order.getStatus());
                            dto.setTotalAmount(order.getTotalAmount());
                            dto.setItems(new java.util.ArrayList<>());
                            return dto;
                        }
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Log error and return empty list
            return new java.util.ArrayList<>();
        }
    }
    
    public List<OrderDTO> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status, String reason) {
        // Validate status
        if (status == null || !VALID_STATUSES.contains(status.toUpperCase())) {
            throw new BadRequestException("Invalid order status: " + status + 
                ". Valid statuses: " + VALID_STATUSES);
        }
        
        status = status.toUpperCase();
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
        
        // Check if order is in final status
        if (FINAL_STATUSES.contains(order.getStatus())) {
            throw new BadRequestException("Cannot update order status. Order is already " + order.getStatus());
        }
        
        // Validate status transition
        validateStatusTransition(order.getStatus(), status);
        
        // Update status and related fields
        order.setStatus(status);
        
        if ("CANCELLED".equals(status)) {
            if (reason == null || reason.trim().isEmpty()) {
                throw new BadRequestException("Cancellation reason is required");
            }
            order.setCancellationReason(reason);
            order.setPaymentStatus("REFUNDED");
        } else if ("RETURNED".equals(status)) {
            if (reason == null || reason.trim().isEmpty()) {
                throw new BadRequestException("Return reason is required");
            }
            order.setReturnReason(reason);
            order.setPaymentStatus("REFUNDED");
        } else if ("SHIPPED".equals(status)) {
            order.setShippingDate(LocalDateTime.now());
        } else if ("DELIVERED".equals(status)) {
            order.setDeliveryDate(LocalDateTime.now());
            order.setPaymentStatus("PAID");
        }
        
        order = orderRepository.save(order);
        return convertToDTO(order);
    }
    
    private void validateStatusTransition(String currentStatus, String newStatus) {
        Set<String> allowedTransitions;
        
        switch (currentStatus) {
            case "PENDING":
                allowedTransitions = PENDING_TRANSITIONS;
                break;
            case "PROCESSING":
                allowedTransitions = PROCESSING_TRANSITIONS;
                break;
            case "SHIPPED":
                allowedTransitions = SHIPPED_TRANSITIONS;
                break;
            default:
                throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
        
        if (!allowedTransitions.contains(newStatus)) {
            throw new BadRequestException("Cannot transition from " + currentStatus + " to " + newStatus + 
                ". Allowed transitions: " + allowedTransitions);
        }
    }
    
    @Transactional
    public OrderDTO processOrder(Long id) {
        return updateOrderStatus(id, "PROCESSING", null);
    }
    
    @Transactional
    public OrderDTO shipOrder(Long id) {
        return updateOrderStatus(id, "SHIPPED", null);
    }
    
    @Transactional
    public OrderDTO cancelOrder(Long id, String reason) {
        return updateOrderStatus(id, "CANCELLED", reason);
    }
    
    @Transactional
    public OrderDTO returnOrder(Long id, String reason) {
        return updateOrderStatus(id, "RETURNED", reason);
    }
    
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setUserId(order.getUserId());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setShippingDate(order.getShippingDate());
        dto.setDeliveryDate(order.getDeliveryDate());
        dto.setCancellationReason(order.getCancellationReason());
        dto.setReturnReason(order.getReturnReason());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        try {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            if (items != null) {
                dto.setItems(items.stream().map(this::convertItemToDTO).collect(Collectors.toList()));
            } else {
                dto.setItems(new java.util.ArrayList<>());
            }
        } catch (Exception e) {
            dto.setItems(new java.util.ArrayList<>());
        }
        
        return dto;
    }
    
    private OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setOrderId(item.getOrderId());
        dto.setProductId(item.getProductId());
        dto.setDesignId(item.getDesignId());
        dto.setQuantity(item.getQuantity());
        dto.setPrice(item.getPrice());
        dto.setSubtotal(item.getSubtotal());
        return dto;
    }
    
    private Order convertToEntity(OrderDTO dto) {
        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setTotalAmount(dto.getTotalAmount());
        order.setShippingAddress(dto.getShippingAddress());
        order.setShippingPhone(dto.getShippingPhone());
        order.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "COD");
        return order;
    }
}


