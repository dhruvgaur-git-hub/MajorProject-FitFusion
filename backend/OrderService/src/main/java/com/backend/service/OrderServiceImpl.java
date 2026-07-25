package com.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custome_exceptions.ResourceNotFoundException;
import com.backend.dtos.OrderItemRequestDto;
import com.backend.dtos.OrderRequestDto;
import com.backend.entities.OrderItems;
import com.backend.entities.Orders;
import com.backend.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	
	private final OrderRepository orderRepo;
	private final ModelMapper mapper;

	@Override
	public String createNewOrder(OrderRequestDto request) {
		String mssg = "Order Creation Failed, Try Again !!";
		Orders order = new Orders();
		order.setCustomerId(request.getCustomerId());
		order.setShippingAddress(request.getShippingAddress());
		order.setStatus(Orders.OrderStatus.PENDING);
		order.setPaymentStatus(Orders.PaymentStatus.PENDING);
		
		List<OrderItems> orderItemsList = new ArrayList<>();
		double totalAmount = 0.0;
		
		for(OrderItemRequestDto itemDto : request.getItems()) {
			
			OrderItems item = mapper.map(itemDto, OrderItems.class);
			item.setOrder(order);
			item.setStatus(OrderItems.OrderItemStatus.ACTIVE);
			
			double platformPrice = itemDto.getRetailerQuotedPrice() + 
									(itemDto.getRetailerQuotedPrice() * itemDto.getCommissionPercent() / 100);
			
			double sellingPrice = platformPrice - (platformPrice * itemDto.getDiscountPercent() /100);
			
			double subtotal = sellingPrice * itemDto.getQuantity();
			
			item.setSellingPrice(sellingPrice);
			item.setSubtotal(subtotal);
			
			orderItemsList.add(item);
			totalAmount += subtotal;
			
		}
		order.setOrderItems(orderItemsList);
		order.setTotalAmount(totalAmount);
		
		Orders savedOrder = orderRepo.save(order);
		
		mssg  = "Order Placed Successfully with ID: " + savedOrder.getOrderId();
		
		return mssg;
		
	}

	@Override
	public Orders getOrderByOrderId(Long orderId) {
		Orders myOrder = orderRepo.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order with OrderId:"+ orderId+" Not Found!!"));
		
		myOrder.getOrderItems().size();
		
		return myOrder;
				
	}

	@Override
	public List<Orders> getOrdersByCustomerId(Long customerId) {
		List<Orders> myOrderList = orderRepo.findAllOrdersByCustomerId(customerId);
		for(Orders i: myOrderList) {
			i.getOrderItems().size();
		}
		return myOrderList;
	}

}
