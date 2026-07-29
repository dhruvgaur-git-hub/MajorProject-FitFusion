package com.backend.respositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Payouts;

public interface PayoutRespository extends JpaRepository<Payouts, Long> {

	Payouts findByOrderItemOrderItemId(Long orderItemId);

	Payouts findByPayoutId(Long payoutId);

}
