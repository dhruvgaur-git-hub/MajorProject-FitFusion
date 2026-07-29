package com.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.ReturnActions;

public interface ReturnActionRepository extends JpaRepository<ReturnActions, Long> {

	List<ReturnActions> findByReturnRequest_ReturnRequestId(Long returnRequestId);

}