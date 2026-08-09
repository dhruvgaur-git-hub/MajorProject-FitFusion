package com.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Refunds;

public interface RefundRepository extends JpaRepository<Refunds, Long> {

	Refunds findByReturnRequest_ReturnRequestId(Long returnRequestId);

	Refunds findByRefundId(Long refundId);

}