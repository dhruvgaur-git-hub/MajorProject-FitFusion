package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.OrderRequestDto;
import com.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;
	
	@PostMapping("/createNewOrder")
	public ResponseEntity<?> createOrder(@RequestBody OrderRequestDto request){
		System.out.println("Creating New Order :" + request);
		
		try {
			return ResponseEntity.ok(orderService.createNewOrder(request));
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<?> getOrderByOrderId(@PathVariable Long orderId){
		System.out.println("Getting Order Details By Id: "+ orderId);
		
		try {
			return ResponseEntity.ok(orderService.getOrderByOrderId(orderId));
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	@GetMapping("/customer/{customerId}")
	public ResponseEntity<?> getOrdersByCustomerId(@PathVariable Long customerId){
		System.out.println("Getting Order Details By Customer Id: "+ customerId);
		try {
			return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	
	
}
