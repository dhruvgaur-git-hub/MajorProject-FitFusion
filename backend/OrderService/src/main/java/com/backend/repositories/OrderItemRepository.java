package com.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.OrderItems;

public interface OrderItemRepository extends JpaRepository<OrderItems, Long> {

	OrderItems findByOrderItemId(Long orderItemId);

}
