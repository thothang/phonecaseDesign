package com.phonecase.design;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.phonecase.design", "com.phonecase.common"})
@EnableDiscoveryClient
@EntityScan("com.phonecase.design.entity")
@EnableJpaRepositories("com.phonecase.design.repository")
public class DesignServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DesignServiceApplication.class, args);
    }
}



