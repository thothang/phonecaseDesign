package com.phonecase.statistics.service;

import com.phonecase.statistics.dto.StatisticsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class StatisticsService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    private Long safeQueryForLong(String sql) {
        try {
            Long result = jdbcTemplate.queryForObject(sql, Long.class);
            return result != null ? result : 0L;
        } catch (EmptyResultDataAccessException e) {
            return 0L;
        } catch (Exception e) {
            // Log error for debugging
            System.err.println("Error executing query: " + sql);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return 0L;
        }
    }
    
    private BigDecimal safeQueryForBigDecimal(String sql) {
        try {
            BigDecimal result = jdbcTemplate.queryForObject(sql, BigDecimal.class);
            return result != null ? result : BigDecimal.ZERO;
        } catch (EmptyResultDataAccessException e) {
            return BigDecimal.ZERO;
        } catch (Exception e) {
            // Log error for debugging
            System.err.println("Error executing query: " + sql);
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return BigDecimal.ZERO;
        }
    }
    
    public StatisticsDTO getStatistics() {
        return getStatistics(null, null); // Default: all time
    }
    
    public StatisticsDTO getStatistics(String period, String startDate) {
        StatisticsDTO stats = new StatisticsDTO();
        
        // Build date filter SQL
        String dateFilter = buildDateFilter(period, startDate);
        
        try {
            // Total Users
            stats.setTotalUsers(safeQueryForLong("SELECT COUNT(*) FROM users"));
            
            // Total Orders with date filter
            String ordersQuery = "SELECT COUNT(*) FROM orders" + dateFilter;
            stats.setTotalOrders(safeQueryForLong(ordersQuery));
            
            // Total Products
            stats.setTotalProducts(safeQueryForLong("SELECT COUNT(*) FROM products WHERE is_active = 1"));
            
            // Total Revenue with date filter
            String revenueQuery = "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'PAID'" + 
                                 (dateFilter.isEmpty() ? "" : " AND " + dateFilter.substring(5)); // Remove " WHERE"
            stats.setTotalRevenue(safeQueryForBigDecimal(revenueQuery));
            
            // Orders by Status with date filter
            String statusFilter = dateFilter.isEmpty() ? "" : dateFilter.substring(5); // Remove " WHERE"
            stats.setPendingOrders(safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'PENDING'" + 
                                                    (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            stats.setCompletedOrders(safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'DELIVERED'" + 
                                                       (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            stats.setCancelledOrders(safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'CANCELLED'" + 
                                                      (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            
            // Orders by Status Map
            Map<String, Long> ordersByStatus = new HashMap<>();
            ordersByStatus.put("PENDING", safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'PENDING'" + 
                                                           (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            ordersByStatus.put("PROCESSING", safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'PROCESSING'" + 
                                                              (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            ordersByStatus.put("SHIPPED", safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'SHIPPED'" + 
                                                           (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            ordersByStatus.put("DELIVERED", safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'DELIVERED'" + 
                                                              (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            ordersByStatus.put("CANCELLED", safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'CANCELLED'" + 
                                                              (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            ordersByStatus.put("RETURNED", safeQueryForLong("SELECT COUNT(*) FROM orders WHERE status = 'RETURNED'" + 
                                                             (statusFilter.isEmpty() ? "" : " AND " + statusFilter)));
            stats.setOrdersByStatus(ordersByStatus);
            
            // Low Stock Products
            stats.setLowStockProducts(safeQueryForLong(
                    "SELECT COUNT(*) FROM inventory WHERE available_quantity < reorder_level"));
        } catch (Exception e) {
            // Log error for debugging
            System.err.println("Error in getStatistics: " + e.getMessage());
            e.printStackTrace();
            // Return default values if any error occurs
            stats.setTotalUsers(0L);
            stats.setTotalOrders(0L);
            stats.setTotalProducts(0L);
            stats.setTotalRevenue(BigDecimal.ZERO);
            stats.setPendingOrders(0L);
            stats.setCompletedOrders(0L);
            stats.setCancelledOrders(0L);
            stats.setOrdersByStatus(new HashMap<>());
            stats.setLowStockProducts(0L);
        }
        
        return stats;
    }
    
    private String buildDateFilter(String period, String startDate) {
        if (period == null || period.isEmpty() || "all".equalsIgnoreCase(period)) {
            return ""; // No filter
        }
        
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        switch (period.toUpperCase()) {
            case "DAY":
                return " WHERE CAST(created_at AS DATE) = '" + today.format(formatter) + "'";
            case "WEEK":
                java.time.LocalDate weekStart = today.minusWeeks(1);
                return " WHERE CAST(created_at AS DATE) >= '" + weekStart.format(formatter) + "'";
            case "MONTH":
                java.time.LocalDate monthStart = today.minusMonths(1);
                return " WHERE CAST(created_at AS DATE) >= '" + monthStart.format(formatter) + "'";
            case "YEAR":
                java.time.LocalDate yearStart = today.minusYears(1);
                return " WHERE CAST(created_at AS DATE) >= '" + yearStart.format(formatter) + "'";
            default:
                return "";
        }
    }
}



