package com.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dtos.ReturnActionDto;
import com.backend.services.ReturnActionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/return-actions")
public class ReturnActionController {

	private final ReturnActionService returnActionService;

	@PostMapping(".createReturnAction")
	public ResponseEntity<?> createReturnAction(@RequestBody ReturnActionDto request) {
		System.out.println("Inside Create Return Action " + request);
		return ResponseEntity.ok(returnActionService.createReturnAction(request));	
	}

	@GetMapping("/return-request/{returnRequestId}")
	public ResponseEntity<?> getActionsByReturnRequestId(@PathVariable Long returnRequestId) {
		System.out.println("Inside Get Return Actions By ReturnRequestId " + returnRequestId);
		return ResponseEntity.ok(returnActionService.getActionsByReturnRequestId(returnRequestId));
	}

}