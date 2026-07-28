package com.backend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dtos.PaymentRequestDto;
import com.backend.entities.Payments;
import com.backend.services.PaymentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
	
	private final PaymentService paymentService;
	
	@PostMapping("/registerNewPayment/{orderId}")
	public ResponseEntity<?> recordNewPayment(@RequestBody PaymentRequestDto request, @PathVariable Long orderId ){
		System.out.println("Record New Payment "+ request+"for OrderId: "+ orderId);
		return ResponseEntity.ok(paymentService.recordNewPayment(request, orderId));
		
	}
	
	@GetMapping("/order/{orderId}")
	public ResponseEntity<?> getPaymentByOrderId(@PathVariable Long orderId){
		System.out.println("Getting Payment info for OrderId: "+ orderId);
		return ResponseEntity.ok(paymentService.getPaymentDetailsByOrderId(orderId));
	} 
	
	@PutMapping("/{paymentId}/status")
	public ResponseEntity<?> updatePaymentStatus(@PathVariable Long paymentId, Payments.PaymentStatus status){
		System.out.println("Updating Payment Status for PaymentId: "+ paymentId+ " To " + status);
		return ResponseEntity.ok(paymentService.updatePaymentStatusByPaymentId(paymentId, status));
		
	}
	

}
