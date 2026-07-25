package com.backend.service;

import java.util.List;

import com.backend.dtos.OrderRequestDto;
import com.backend.entities.Orders;

public interface OrderService {

	String createNewOrder(OrderRequestDto request);

	Orders getOrderByOrderId(Long orderId);

	List<Orders> getOrdersByCustomerId(Long customerId);
}
