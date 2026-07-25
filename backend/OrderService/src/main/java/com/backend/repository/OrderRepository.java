package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entities.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

	Orders findByOrderId(Long orderId);

	List<Orders> findAllOrdersByCustomerId(Long customerId);

}
