package com.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Payments;

public interface PaymentRepository extends JpaRepository<Payments, Long> {

	Payments findByOrderOrderId(Long orderId);

	Payments findByPaymentId(Long paymentId);
	
	Payments findByRazorpayOrderId(String razorpayOrderId);


}
