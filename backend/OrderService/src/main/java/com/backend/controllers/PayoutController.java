package com.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.entities.Payouts;
import com.backend.services.PayoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payout")
public class PayoutController {
	
	private final PayoutService payoutService;
	
	@PostMapping("/{orderItemId}")
	public ResponseEntity<?> createPayout(@PathVariable Long orderItemId){
		System.out.println("Creating new Payout for Order Item ID: "+ orderItemId);
		return ResponseEntity.ok(payoutService.createPayoutForOrderItemId(orderItemId));
	}
	
	@GetMapping("/order-item/{orderItemId}")
	public ResponseEntity<?> getPayoutByOrderItemId(@PathVariable Long orderItemId){
		System.out.println("Get Payout for Order Item ID: "+ orderItemId);
		return ResponseEntity.ok(payoutService.getPayoutByOrderItemId(orderItemId));
	}
	
	@PutMapping("/{payoutId}/status")
	public ResponseEntity<?> updatePayoutStatus(@PathVariable Long payoutId, @RequestParam Payouts.PayoutStatus status){
		System.out.println("Updating Payout Status Payout ID: "+ payoutId +" To " + status);
		return ResponseEntity.ok(payoutService.updatePayoutByPayoutId(payoutId, status));
	}
}
