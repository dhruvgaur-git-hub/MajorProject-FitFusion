package com.backend.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "orders")
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Orders {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long orderId;
	
	@Column(nullable = false)
	private Long customerId;
	
	@Embedded
	private ShippingAddress shippingAddress;
	
	@Column(nullable= false)
	private Double totalAmount;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private OrderStatus status;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	private PaymentStatus paymentStatus;
	
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	@UpdateTimestamp
	private LocalDateTime updatedAt;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	@ToString.Exclude
	private List<OrderItems> orderItems = new ArrayList<>();
	
	public enum OrderStatus{
        PENDING, CONFIRMED, PROCESSING, SHIPPED, PARTIALLY_SHIPPED, DELIVERED, CANCELLED, RETURNED
	}
	
	public enum PaymentStatus{
        PENDING, SUCCESS, FAILED, REFUNDED
	}
	
	
	
	
	
	
	
	
}
