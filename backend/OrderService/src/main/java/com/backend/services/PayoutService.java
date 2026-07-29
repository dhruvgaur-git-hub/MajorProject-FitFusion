package com.backend.services;

import com.backend.entities.Payouts;
import com.backend.entities.Payouts.PayoutStatus;

public interface PayoutService {

	String createPayoutForOrderItemId(Long orderItemId);

	Payouts getPayoutByOrderItemId(Long orderItemId);

	String updatePayoutByPayoutId(Long payoutId, PayoutStatus status);

}
