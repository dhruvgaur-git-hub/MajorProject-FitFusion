package com.backend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.entities.OrderItems;
import com.backend.entities.Payouts;
import com.backend.entities.Payouts.PayoutStatus;
import com.backend.repositories.OrderItemRepository;
import com.backend.repositories.PayoutRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PayoutServiceImpl implements PayoutService {
	private final PayoutRepository payoutRepo;
	private final OrderItemRepository orderItemRepo;
	
	@Override
	public String createPayoutForOrderItemId(Long orderItemId) {
		String mssg = "Payout for orderItemId "+ orderItemId+" Creation Failed!";
		
			OrderItems myItem = orderItemRepo.findByOrderItemId(orderItemId);

			if (myItem == null) {
				throw new InvalidOperationException("Invalid Order Item Id!!");
			}

			if (payoutRepo.findByOrderItemOrderItemId(orderItemId) != null) {
				throw new InvalidOperationException("Payout already exists for this order item!!");
			}

			double amount = myItem.getRetailerQuotedPrice() * myItem.getQuantity();
			double commissionAmount = myItem.getSubtotal() - amount;

			Payouts payout = new Payouts();
			payout.setOrderItem(myItem);
			payout.setRetailerId(myItem.getRetailerId());
			payout.setAmount(amount);
			payout.setCommissionAmount(commissionAmount);
			payout.setNetAmount(amount);
			payout.setStatus(PayoutStatus.PENDING);

			payoutRepo.save(payout);

			mssg = "Payout successfully created for orderItemId " + orderItemId + ": " + payout;
		
		return mssg;
	}
	
	@Override
	public Payouts getPayoutByOrderItemId(Long orderItemId) {
		Payouts payout = payoutRepo.findByOrderItemOrderItemId(orderItemId);

		if (payout == null) {
			throw new InvalidOperationException("No payout found for orderItemId: " + orderItemId);
		}

		return payout;
	}
	
	@Override
	public String updatePayoutByPayoutId(Long payoutId, PayoutStatus status) {
		String mssg = "Payout Status Update Failed !!";
			Payouts payout = payoutRepo.findByPayoutId(payoutId);

			if (payout == null) {
				throw new InvalidOperationException("Invalid Payout Id!!");
			}

			payout.setStatus(status);
			payoutRepo.save(payout);

			mssg = "Payout Status Updated to " + status + " Successfully!!";

		return mssg;
	}

	@Override
	public List<Payouts> getPayoutsByRetailerId(Long retailerId) {
		return payoutRepo.findByRetailerId(retailerId);
	}
	
	@Override
	public List<Payouts> getAllPayouts() {
		return payoutRepo.findAll();
	}

}
