package com.phonecase.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication(scanBasePackages = {"com.phonecase.inventory", "com.phonecase.common"})
@EnableDiscoveryClient
@EnableRetry
@EntityScan("com.phonecase.inventory.entity")
@EnableJpaRepositories("com.phonecase.inventory.repository")
public class InventoryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }
}


