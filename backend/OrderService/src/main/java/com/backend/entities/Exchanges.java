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
@Table(name = "exchanges")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Exchanges {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long exchangeId;
	
	@OneToOne
	@JoinColumn(name = "return_request_id", nullable = false, unique = true)
	@ToString.Exclude
	private ReturnRequests returnRequest;
	
	@Column(nullable = false)
	private String newVariantId;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ExchangeStatus status;
	
	public enum ExchangeStatus{
		PENDING, PROCESSED, FAILED 
	}
	
}
