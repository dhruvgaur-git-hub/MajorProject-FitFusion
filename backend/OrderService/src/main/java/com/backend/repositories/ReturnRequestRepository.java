package com.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.ReturnRequests;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequests, Long> {

	List<ReturnRequests> findByOrderItem_OrderItemId(Long orderItemId);

	ReturnRequests findByReturnRequestId(Long returnRequestId);

}