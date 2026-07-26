package com.backend.controllers;


import org.springframework.http.HttpStatus;
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
		try {
			return ResponseEntity.ok(returnRequestService.createReturnRequest(request));
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@GetMapping("/order-item/{orderItemId}")
	public ResponseEntity<?> getReturnRequestsByOrderItemId(@PathVariable Long orderItemId) {
		System.out.println("Inside Get Return Requests By OrderItemId " + orderItemId);
		try {
			return ResponseEntity.ok(returnRequestService.getReturnRequestsByOrderItemId(orderItemId));
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PutMapping("/{returnRequestId}/review")
	public ResponseEntity<?> reviewReturnRequest(@PathVariable Long returnRequestId, @RequestParam Long adminId, @RequestParam ReturnRequestStatus status) {
		System.out.println("Inside Review Return Request " + returnRequestId);
		try {
			return ResponseEntity.ok(returnRequestService.reviewReturnRequest(returnRequestId, adminId, status));
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

}