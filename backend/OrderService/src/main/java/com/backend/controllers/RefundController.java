package com.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dtos.RefundDto;
import com.backend.entities.Refunds.RefundStatus;
import com.backend.services.RefundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/refunds")
public class RefundController {

	private final RefundService refundService;

	@PostMapping
	public ResponseEntity<?> createRefund(@RequestBody RefundDto request) {
		System.out.println("Inside Create Refund " + request);
		return ResponseEntity.ok(refundService.createRefund(request));
	}

	@GetMapping("/return-request/{returnRequestId}")
	public ResponseEntity<?> getRefundByReturnRequestId(@PathVariable Long returnRequestId) {
		System.out.println("Inside Get Refund By ReturnRequestId " + returnRequestId);
		return ResponseEntity.ok(refundService.getRefundByReturnRequestId(returnRequestId));
	}

	@PutMapping("/{refundId}/status")
	public ResponseEntity<?> updateRefundStatus(@PathVariable Long refundId, @RequestParam RefundStatus status) {
		System.out.println("Inside Update Refund Status " + refundId + " -> " + status);
		return ResponseEntity.ok(refundService.updateRefundStatus(refundId, status));
	}

}