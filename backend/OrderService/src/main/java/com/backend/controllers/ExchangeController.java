package com.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dtos.ExchangeDto;
import com.backend.entities.Exchanges.ExchangeStatus;
import com.backend.services.ExchangeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/exchanges")
public class ExchangeController {

	private final ExchangeService exchangeService;

	@PostMapping("/createExchange")
	public ResponseEntity<?> createExchange(@RequestBody ExchangeDto request) {
		System.out.println("Inside Create Exchange " + request);
		try {
			return ResponseEntity.ok(exchangeService.createExchange(request));
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@GetMapping("/return-request/{returnRequestId}")
	public ResponseEntity<?> getExchangeByReturnRequestId(@PathVariable Long returnRequestId) {
		System.out.println("Inside Get Exchange By ReturnRequestId " + returnRequestId);
		try {
			return ResponseEntity.ok(exchangeService.getExchangeByReturnRequestId(returnRequestId));
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PutMapping("/{exchangeId}/status")
	public ResponseEntity<?> updateExchangeStatus(@PathVariable Long exchangeId, @RequestParam ExchangeStatus status) {
		System.out.println("Inside Update Exchange Status " + exchangeId + " -> " + status);
		try {
			return ResponseEntity.ok(exchangeService.updateExchangeStatus(exchangeId, status));
		}
		catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

}