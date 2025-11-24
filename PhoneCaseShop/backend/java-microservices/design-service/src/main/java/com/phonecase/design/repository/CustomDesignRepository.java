package com.phonecase.design.repository;

import com.phonecase.design.entity.CustomDesign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomDesignRepository extends JpaRepository<CustomDesign, Long> {
    List<CustomDesign> findByUserId(Long userId);
}



