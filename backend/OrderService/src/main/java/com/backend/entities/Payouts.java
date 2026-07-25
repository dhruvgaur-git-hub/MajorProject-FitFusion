package com.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "payouts")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Payouts {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long payoutId;
	
	@OneToOne
	@JoinColumn(name = "order_item_id", nullable = false, unique = true)
	@ToString.Exclude
	private OrderItems orderItem;
	
	@Column(nullable = false)
	private Long retailerId;
	
	@Column(nullable = false)
	private Double amount;
	
	@Column(nullable = false)
	private Double commissionAmount;
	
	@Column(nullable = false)
	private Double netAmount;
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PayoutStatus status;
	
	public enum PayoutStatus{
		PENDING, PROCESSED, FAILED
	}

}
