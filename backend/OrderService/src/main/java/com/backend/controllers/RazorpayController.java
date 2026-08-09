package com.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dtos.RazorpayVerifyRequestDto;
import com.backend.services.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments/razorpay")
public class RazorpayController {

	private final PaymentService paymentService;

	@PostMapping("/createOrder/{orderId}")
	public ResponseEntity<?> createOrder(@PathVariable Long orderId) throws Exception {
		return ResponseEntity.ok(paymentService.createRazorpayOrder(orderId));
	}

	@PostMapping("/verify")
	public ResponseEntity<?> verify(@Valid @RequestBody RazorpayVerifyRequestDto request) throws Exception {
		return ResponseEntity.ok(paymentService.verifyRazorpayPayment(request));
	}

	@PostMapping("/webhook")
	public ResponseEntity<?> webhook(@RequestBody String rawPayload, @RequestHeader("X-Razorpay-Signature") String signature) throws Exception {
		paymentService.handleRazorpayWebhook(rawPayload, signature);
		return ResponseEntity.ok().build();
	}

}