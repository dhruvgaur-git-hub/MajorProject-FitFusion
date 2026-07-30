package com.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.OrderRequestDto;
import com.backend.entities.OrderItems;
import com.backend.entities.Orders;
import com.backend.security.JwtUser;
import com.backend.services.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
	
	private final OrderService orderService;
	
	@PostMapping("/createNewOrder")
	public ResponseEntity<?> createOrder(@AuthenticationPrincipal JwtUser user, @Valid @RequestBody OrderRequestDto request){
		System.out.println("Creating New Order :" + request);
		request.setCustomerId(user.getUserId());
		return ResponseEntity.ok(orderService.createNewOrder(request));
	}
	
	@GetMapping("/{orderId}")
	public ResponseEntity<?> getOrderByOrderId(@AuthenticationPrincipal JwtUser user, @PathVariable Long orderId){
		System.out.println("Getting Order Details By Id: "+ orderId);		
		Orders order = orderService.getOrderByOrderId(orderId);
		if (!user.getRole().equals("ADMIN") && !order.getCustomerId().equals(user.getUserId())) {
			throw new InvalidOperationException("You are not authorized to view this order!!");
		}
		return ResponseEntity.ok(order);
	}
	
	@GetMapping("/customer/{customerId}")
	public ResponseEntity<?> getOrdersByCustomerId(@AuthenticationPrincipal JwtUser user, @PathVariable Long customerId){
		System.out.println("Getting Order Details By Customer Id: "+ customerId);
		if (!user.getRole().equals("ADMIN") && !user.getUserId().equals(customerId)) {
			throw new InvalidOperationException("You are not authorized to view these orders!!");
		}
		return ResponseEntity.ok(orderService.getOrdersByCustomerId(customerId));
	}
	
	@PutMapping("/{orderId}/status")
	public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, Orders.OrderStatus status){
		System.out.println("Updating the OrderId: " +orderId+ "'s Status to "+ status);
		return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
	}
	
	@PutMapping("/{orderId}/item/{orderItemId}/status")
	public ResponseEntity<?> updateOrderItemStatus(@PathVariable Long orderItemId, OrderItems.OrderItemStatus status){
		System.out.println("Updating the OrderItemId: " +orderItemId+ "'s Status to "+ status);
		return ResponseEntity.ok(orderService.updateOrderItemStatus(orderItemId, status));
	}
	
	
	
}
