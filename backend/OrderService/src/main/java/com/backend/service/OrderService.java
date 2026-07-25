package com.backend.service;

import com.backend.dtos.OrderRequestDto;

public interface OrderService {

	String createNewOrder(OrderRequestDto request);

}
