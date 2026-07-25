package com.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "return_requests")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class ReturnRequests {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long returnRequestId;
	
	@ManyToOne
	@JoinColumn(name = "order_item_id", nullable= false)
	@ToString.Exclude
	private OrderItems orderItem;
	
	@Column(nullable = false)
	private Long customerId;
	
	private Long reviewedBy;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private RequestType requestType;
	
	@Column(nullable = false)
	private String reason;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ReturnRequestStatus status;
	
	public enum RequestType{
		RETURN, EXCHANGE
	}
	
	public enum ReturnRequestStatus{
		PENDING, APPROVED, REJECTED, COMPLETED
	}

}
