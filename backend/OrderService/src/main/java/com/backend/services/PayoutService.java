package com.backend.services;

import java.util.List;

import com.backend.entities.Payouts;
import com.backend.entities.Payouts.PayoutStatus;

public interface PayoutService {

	String createPayoutForOrderItemId(Long orderItemId);

	Payouts getPayoutByOrderItemId(Long orderItemId);
	
	List<Payouts> getPayoutsByRetailerId(Long retailerId);
	
	List<Payouts> getAllPayouts();

	String updatePayoutByPayoutId(Long payoutId, PayoutStatus status);
	
	

}
