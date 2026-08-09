package com.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Payouts;

public interface PayoutRepository extends JpaRepository<Payouts, Long> {

	Payouts findByOrderItemOrderItemId(Long orderItemId);

	Payouts findByPayoutId(Long payoutId);
	
	List<Payouts> findByRetailerId(Long retailerId);

}
