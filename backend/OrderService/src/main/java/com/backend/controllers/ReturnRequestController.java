package com.backend.controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dtos.ReturnRequestDto;
import com.backend.entities.ReturnRequests.ReturnRequestStatus;
import com.backend.services.ReturnRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/return-requests")
public class ReturnRequestController {

	private final ReturnRequestService returnRequestService;

	@PostMapping("/createReturnRequest")
	public ResponseEntity<?> createReturnRequest(@RequestBody ReturnRequestDto request) {
		System.out.println("Inside Create Return Request " + request);
		return ResponseEntity.ok(returnRequestService.createReturnRequest(request));
		
	}

	@GetMapping("/order-item/{orderItemId}")
	public ResponseEntity<?> getReturnRequestsByOrderItemId(@PathVariable Long orderItemId) {
		System.out.println("Inside Get Return Requests By OrderItemId " + orderItemId);
		return ResponseEntity.ok(returnRequestService.getReturnRequestsByOrderItemId(orderItemId));
		
	}

	@PutMapping("/{returnRequestId}/review")
	public ResponseEntity<?> reviewReturnRequest(@PathVariable Long returnRequestId, @RequestParam Long adminId, @RequestParam ReturnRequestStatus status) {
		System.out.println("Inside Review Return Request " + returnRequestId);
		return ResponseEntity.ok(returnRequestService.reviewReturnRequest(returnRequestId, adminId, status));
		
	}

}