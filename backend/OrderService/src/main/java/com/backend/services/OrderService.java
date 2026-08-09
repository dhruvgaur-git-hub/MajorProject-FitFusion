package com.backend.services;

import java.util.List;

import com.backend.dtos.OrderRequestDto;
import com.backend.entities.OrderItems.OrderItemStatus;
import com.backend.entities.Orders;
import com.backend.entities.Orders.OrderStatus;

public interface OrderService {

	Orders createNewOrder(OrderRequestDto request);

	Orders getOrderByOrderId(Long orderId);

	List<Orders> getOrdersByCustomerId(Long customerId);

	List<Orders> getAllOrders();

	String updateOrderStatus(Long orderId, OrderStatus status);

	String updateOrderItemStatus(Long orderItemId, OrderItemStatus status);
	
	byte[] generateInvoice(Orders order, String jwtToken);
}