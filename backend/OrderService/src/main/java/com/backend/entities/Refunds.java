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
@Table(name = "refunds")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Refunds {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long refundId;
	
	@OneToOne
	@JoinColumn(name = "return_request_id", nullable = false, unique = true)
	@ToString.Exclude
	private ReturnRequests returnRequest;
	
	@Column(nullable = false)
	private Double amount;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RefundStatus status;
	
	public enum RefundStatus{
		PENDING, PROCESSED, FAILED
	}
}
