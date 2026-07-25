package com.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.OrderItemRequestDto;
import com.backend.dtos.OrderRequestDto;
import com.backend.entities.OrderItems;
import com.backend.entities.OrderItems.OrderItemStatus;
import com.backend.entities.Orders;
import com.backend.entities.Orders.OrderStatus;
import com.backend.repositories.OrderItemRepository;
import com.backend.repositories.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
	
	private final OrderRepository orderRepo;
	private final OrderItemRepository orderItemRepo;
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
		for(Orders item: myOrderList) {
			item.getOrderItems().size();
		}
		return myOrderList;
	}

	@Override
	public String updateOrderStatus(Long orderId, OrderStatus status) {
		try {
			String mssg = "Updation Failed !!";
			Orders order = orderRepo.findByOrderId(orderId);
			if(order == null) {
				throw new InvalidOperationException("Invalid Order Id!!");
			}
			else {
				order.setStatus(status);
				orderRepo.save(order);
				mssg = "Order Status Updated to "+status+" Successfully!!";
			}
			return mssg;
		}
		catch(RuntimeException e) {
			return e.getLocalizedMessage();
		}
		
	}

	@Override
	public String updateOrderItemStatus(Long orderItemId, OrderItemStatus status) {
		String mssg = "Updation Failed !!";
		try {
			OrderItems item = orderItemRepo.findByOrderItemId(orderItemId);
			if(item != null) {
				item.setStatus(status);
				orderItemRepo.save(item);
				mssg ="Order Item Status Updated Successfully to "+ status;
			}
			else {
				throw new ResourceNotFoundException("Invalid Order Item Id!!");
			}
		}
		catch (RuntimeException e) {
			mssg = e.getLocalizedMessage();
		}
		return mssg;
		
	}
	

}
