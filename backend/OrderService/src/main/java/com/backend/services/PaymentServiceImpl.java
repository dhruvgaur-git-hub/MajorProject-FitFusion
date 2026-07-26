package com.backend.services;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.dtos.PaymentRequestDto;
import com.backend.entities.Orders;
import com.backend.entities.Payments;
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
		try{		
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
		}
		catch(RuntimeException e) {
			mssg = e.getLocalizedMessage();
		}
		return mssg;
	}

}
