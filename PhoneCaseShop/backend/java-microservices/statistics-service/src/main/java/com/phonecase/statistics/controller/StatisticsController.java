package com.phonecase.statistics.controller;

import com.phonecase.statistics.dto.StatisticsDTO;
import com.phonecase.statistics.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    
    @Autowired
    private StatisticsService statisticsService;
    
    @GetMapping
    public ResponseEntity<StatisticsDTO> getStatistics(
            @RequestParam(value = "period", required = false) String period,
            @RequestParam(value = "startDate", required = false) String startDate) {
        StatisticsDTO stats = statisticsService.getStatistics(period, startDate);
        return ResponseEntity.ok(stats);
    }
}



