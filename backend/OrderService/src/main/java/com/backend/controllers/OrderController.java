package com.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.OrderRequestDto;
import com.backend.entities.OrderItems;
import com.backend.entities.Orders;
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
	
	@PutMapping("/{orderId}/status")
	public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, Orders.OrderStatus status){
		System.out.println("Updating the OrderId: " +orderId+ "'s Status to "+ status);
		
		try {
			return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	@PutMapping("/{orderId}/item/{orderItemId}/status")
	public ResponseEntity<?> updateOrderItemStatus(@PathVariable Long orderItemId, OrderItems.OrderItemStatus status){
		System.out.println("Updating the OrderItemId: " +orderItemId+ "'s Status to "+ status);
		
		try {
			return ResponseEntity.ok(orderService.updateOrderItemStatus(orderItemId, status));
		}
		catch(RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	
	
}
