package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "payments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Payments {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long paymentId;
	
	@OneToOne
	@JoinColumn(name = "order_id", nullable = false, unique = true)
	@ToString.Exclude
	@JsonIgnore
	private Orders order;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentMode paymentMode;
	
	@Column(nullable = false)
	private String transactionId;
	
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PaymentStatus status;
	
	@Column(nullable = false)
	private Double amount;
	
	public enum PaymentMode{
		UPI, CARD, NET_BANKING, COD, WALLET
	}
	
	public enum PaymentStatus{
		PENDING, SUCCESS, FAILED, REFUNDED
	}
	
	
	
}
