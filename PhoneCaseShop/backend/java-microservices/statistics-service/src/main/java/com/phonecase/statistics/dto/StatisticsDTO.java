package com.phonecase.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private Long totalUsers;
    private Long totalOrders;
    private Long totalProducts;
    private BigDecimal totalRevenue;
    private Long pendingOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    private Map<String, Long> ordersByStatus;
    private Map<String, BigDecimal> revenueByMonth;
    private Long lowStockProducts;
}



