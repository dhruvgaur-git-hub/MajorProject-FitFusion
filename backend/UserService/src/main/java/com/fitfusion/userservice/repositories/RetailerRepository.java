package com.fitfusion.userservice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitfusion.userservice.entities.Retailer;
import com.fitfusion.userservice.entities.RetailerStatus;

public interface RetailerRepository extends JpaRepository<Retailer, Long>{

	List<Retailer> findByStatus(RetailerStatus status);
}
