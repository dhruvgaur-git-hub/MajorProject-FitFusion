package com.backend.services;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.clients.CatalogServiceClient;
import com.backend.clients.UserServiceClient;
import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.OrderItemRequestDto;
import com.backend.dtos.OrderRequestDto;
import com.backend.dtos.external.CommissionRuleResponseDto;
import com.backend.dtos.external.DiscountRuleResponseDto;
import com.backend.dtos.external.InventoryResponseDto;
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
	private final UserServiceClient userServiceClient;
	private final CatalogServiceClient catalogServiceClient;
	private final PayoutService payoutService;

	@Override
	public Orders createNewOrder(OrderRequestDto request) {

		Orders order = new Orders();
		order.setCustomerId(request.getCustomerId());
		order.setShippingAddress(request.getShippingAddress());
		order.setStatus(Orders.OrderStatus.PENDING);
		order.setPaymentStatus(Orders.PaymentStatus.PENDING);

		List<OrderItems> orderItemsList = new ArrayList<>();
		double totalAmount = 0.0;

		for (OrderItemRequestDto itemDto : request.getItems()) {

			// 1. Get authoritative stock + price from Catalog Service
			InventoryResponseDto inventory = catalogServiceClient.getInventory(
					itemDto.getVariantId(), itemDto.getRetailerId());

			int availableStock = inventory.getQuantity() - inventory.getReservedQuantity();
			if (!Boolean.TRUE.equals(inventory.getActive()) || availableStock < itemDto.getQuantity()) {
				throw new InvalidOperationException(
						"Insufficient stock for product: " + itemDto.getProductName());
			}

			// 2. Get real commission/discount rules from User Service
			CommissionRuleResponseDto commissionRule =
					userServiceClient.getCommissionRule(itemDto.getCategoryId());
			DiscountRuleResponseDto discountRule =
					userServiceClient.getDiscountRule(itemDto.getCategoryId());

			double retailerQuotedPrice = inventory.getRetailerQuotedPrice();
			double commissionPercent = commissionRule.getCommissionPercent();
			double discountPercent = discountRule.getDiscountPercent();

			// 3. Compute pricing server-side — client input is never trusted
			double platformPrice = retailerQuotedPrice + (retailerQuotedPrice * commissionPercent / 100);
			double sellingPrice = platformPrice - (platformPrice * discountPercent / 100);
			double subtotal = sellingPrice * itemDto.getQuantity();

			OrderItems item = mapper.map(itemDto, OrderItems.class);
			item.setOrder(order);
			item.setStatus(OrderItemStatus.ACTIVE);
			item.setRetailerQuotedPrice(retailerQuotedPrice);
			item.setCommissionPercent(commissionPercent);
			item.setDiscountPercent(discountPercent);
			item.setSellingPrice(sellingPrice);
			item.setSubtotal(subtotal);

			orderItemsList.add(item);
			totalAmount += subtotal;
		}

		order.setOrderItems(orderItemsList);
		order.setTotalAmount(totalAmount);

		Orders savedOrder = orderRepo.save(order);

		return savedOrder;
	}

	@Override
	public Orders getOrderByOrderId(Long orderId) {
		Orders myOrder = orderRepo.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order with OrderId:" + orderId + " Not Found!!"));
		myOrder.getOrderItems().size();
		return myOrder;
	}

	@Override
	public List<Orders> getOrdersByCustomerId(Long customerId) {
		List<Orders> myOrderList = orderRepo.findAllOrdersByCustomerId(customerId);
		for (Orders item : myOrderList) {
			item.getOrderItems().size();
		}
		return myOrderList;
	}

	@Override
	public String updateOrderStatus(Long orderId, OrderStatus status) {
		Orders order = orderRepo.findByOrderId(orderId);
		if (order == null) {
			throw new InvalidOperationException("Invalid Order Id!!");
		}
		order.setStatus(status);
		orderRepo.save(order);

		if (status == OrderStatus.DELIVERED) {
			for (OrderItems item : order.getOrderItems()) {
				if (item.getStatus() == OrderItemStatus.ACTIVE) {
					try {
						payoutService.createPayoutForOrderItemId(item.getOrderItemId());
					} catch (InvalidOperationException e) {
						System.out.println("Payout already exists for orderItemId " + item.getOrderItemId() + ", skipping.");
					}
				}
			}
		}

		return "Order Status Updated to " + status + " Successfully!!";
	}

	@Override
	public String updateOrderItemStatus(Long orderItemId, OrderItemStatus status) {
		OrderItems item = orderItemRepo.findByOrderItemId(orderItemId);
		if (item == null) {
			throw new ResourceNotFoundException("Invalid Order Item Id!!");
		}
		item.setStatus(status);
		orderItemRepo.save(item);
		return "Order Item Status Updated Successfully to " + status;
	}
	
	@Override
	public List<Orders> getAllOrders() {
		List<Orders> allOrders = orderRepo.findAll();
		for (Orders order : allOrders) {
			order.getOrderItems().size();
		}
		return allOrders;
	}
	
	
	
	
}