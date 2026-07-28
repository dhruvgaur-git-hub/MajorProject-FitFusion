package com.backend.services;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.PaymentRequestDto;
import com.backend.entities.Orders;
import com.backend.entities.Payments;
import com.backend.entities.Payments.PaymentStatus;
import com.backend.repositories.OrderRepository;
import com.backend.repositories.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
	private final PaymentRepository paymentRepo;
	private final OrderRepository orderRepo;
	private final ModelMapper mapper;

	@Override
	public String recordNewPayment(PaymentRequestDto request,Long orderId) {
		String mssg = "Payment Failed !!";
				
			Orders order = orderRepo.findByOrderId(orderId);
			if(order == null) {
				throw new InvalidOperationException("Invalid Order Id !!");
			}
			if(paymentRepo.findByOrderOrderId(orderId) != null) {
				throw new InvalidOperationException("Payment already exists for this order!!");
			}
			Payments myPayment = mapper.map(request, Payments.class);
			myPayment.setOrder(order);
			myPayment.setStatus(request.getStatus());
				
			order.setPaymentStatus(Orders.PaymentStatus.valueOf(request.getStatus().name()));
			
			orderRepo.save(order);
			paymentRepo.save(myPayment);
			mssg = "Payment successfully registered: "+ myPayment +" | for OrderId: " + orderId;
		
		return mssg;
	}

	@Override
	public Payments getPaymentDetailsByOrderId(Long orderId) {
		
			Payments myPayment = paymentRepo.findByOrderOrderId(orderId);
			if(myPayment == null) {
				throw new ResourceNotFoundException("Payment with OrderId: " + orderId + " Not Found !!");
			}
			return myPayment;
	}

	@Override
	public String updatePaymentStatusByPaymentId(Long paymentId, PaymentStatus status) {
		String mssg = "Updation Failed!!";
			Payments myPayment = paymentRepo.findByPaymentId(paymentId);
			Orders order = orderRepo.findByOrderId(myPayment.getOrder().getOrderId());
			if(order == null) {
				throw new InvalidOperationException("Invalid Order Id !!");
			}
			myPayment.setStatus(status);
			order.setPaymentStatus(Orders.PaymentStatus.valueOf(status.name()));
			paymentRepo.save(myPayment);
			mssg = "Payment status for PaymentId: "+ paymentId + " Updated Successfully to -> "+ status;
		return mssg;
	}
	
	
	

}
