package com.backend.services;

import java.nio.charset.StandardCharsets;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.custom_exceptions.InvalidOperationException;
import com.backend.custom_exceptions.ResourceNotFoundException;
import com.backend.dtos.PaymentRequestDto;
import com.backend.dtos.RazorpayOrderResponseDto;
import com.backend.dtos.RazorpayVerifyRequestDto;
import com.backend.entities.Orders;
import com.backend.entities.Payments;
import com.backend.entities.Payments.PaymentStatus;
import com.backend.repositories.OrderRepository;
import com.backend.repositories.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
	private final PaymentRepository paymentRepo;
	private final OrderRepository orderRepo;
	private final ModelMapper mapper;
	
	private final RazorpayClient razorpayClient;

	@Value("${razorpay.key.id}")
	private String razorpayKeyId;

	@Value("${razorpay.key.secret}")
	private String razorpayKeySecret;

	@Value("${razorpay.webhook.secret}")
	private String razorpayWebhookSecret;

	@Override
	public String recordNewPayment(PaymentRequestDto request,Long orderId) {
		String mssg = "Payment Failed !!";
				
			Orders order = orderRepo.findByOrderId(orderId);
			if(order == null) {
				throw new InvalidOperationException("Invalid Order Id !!");
			}
			if(paymentRepo.findByOrderOrderId(orderId) != null) {
				throw new InvalidOperationException("Payment already exists for this order!!");
			}
			Payments myPayment = mapper.map(request, Payments.class);
			myPayment.setOrder(order);
			myPayment.setStatus(request.getStatus());
				
			order.setPaymentStatus(Orders.PaymentStatus.valueOf(request.getStatus().name()));
			
			orderRepo.save(order);
			paymentRepo.save(myPayment);
			mssg = "Payment successfully registered: "+ myPayment +" | for OrderId: " + orderId;
		
		return mssg;
	}

	@Override
	public Payments getPaymentDetailsByOrderId(Long orderId) {
		
			Payments myPayment = paymentRepo.findByOrderOrderId(orderId);
			if(myPayment == null) {
				throw new ResourceNotFoundException("Payment with OrderId: " + orderId + " Not Found !!");
			}
			return myPayment;
	}

	@Override
	public String updatePaymentStatusByPaymentId(Long paymentId, PaymentStatus status) {
		String mssg = "Updation Failed!!";
			Payments myPayment = paymentRepo.findByPaymentId(paymentId);
			Orders order = orderRepo.findByOrderId(myPayment.getOrder().getOrderId());
			if(order == null) {
				throw new InvalidOperationException("Invalid Order Id !!");
			}
			myPayment.setStatus(status);
			order.setPaymentStatus(Orders.PaymentStatus.valueOf(status.name()));
			paymentRepo.save(myPayment);
			mssg = "Payment status for PaymentId: "+ paymentId + " Updated Successfully to -> "+ status;
		return mssg;
	}
	
	//RZP
	@Override
	public RazorpayOrderResponseDto createRazorpayOrder(Long orderId) throws Exception {
		Orders order = orderRepo.findByOrderId(orderId);
		if (order == null) {
			throw new ResourceNotFoundException("Invalid Order Id!!");
		}

		if (paymentRepo.findByOrderOrderId(orderId) != null) {
			throw new InvalidOperationException("Payment already initiated for this order!!");
		}

		long amountInPaise = Math.round(order.getTotalAmount() * 100);

		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", amountInPaise);
		orderRequest.put("currency", "INR");
		orderRequest.put("receipt", "order_rcpt_" + orderId);

		Order razorpayOrder = razorpayClient.orders.create(orderRequest);
		String razorpayOrderId = razorpayOrder.get("id");

		Payments payment = new Payments();
		payment.setOrder(order);
		payment.setRazorpayOrderId(razorpayOrderId);
		payment.setAmount(order.getTotalAmount());
		payment.setStatus(PaymentStatus.PENDING);
		paymentRepo.save(payment);

		log.info("Razorpay order created: {} for OrderId: {}", razorpayOrderId, orderId);

		return new RazorpayOrderResponseDto(razorpayOrderId, amountInPaise, "INR", razorpayKeyId);
	
	}

	@Override
	public String verifyRazorpayPayment(RazorpayVerifyRequestDto request) throws Exception {
		String mssg = "Verification Failed!";
		Payments payment = paymentRepo.findByRazorpayOrderId(request.getRazorpayOrderId());
		if (payment == null) {
			throw new ResourceNotFoundException("No payment found for this Razorpay order!!");
		}

		if (payment.getStatus() == PaymentStatus.SUCCESS) {
			return "Payment already verified successfully.";
		}

		String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
		String generatedSignature = generateHmacSha256(payload, razorpayKeySecret);

		if (!generatedSignature.equals(request.getRazorpaySignature())) {
			throw new InvalidOperationException("Payment verification failed! Signature mismatch.");
		}

		payment.setTransactionId(request.getRazorpayPaymentId());
		payment.setStatus(PaymentStatus.SUCCESS);
		paymentRepo.save(payment);

		Orders order = payment.getOrder();
		order.setPaymentStatus(Orders.PaymentStatus.SUCCESS);
		orderRepo.save(order);

		log.info("Payment verified successfully for RazorpayOrderId: {}", request.getRazorpayOrderId());

		mssg= "Payment verified and recorded successfully!";
		return mssg;
	}
	

	@Override
	public void handleRazorpayWebhook(String rawPayload, String signatureHeader) throws Exception {
		String generatedSignature = generateHmacSha256(rawPayload, razorpayWebhookSecret);

		if (!generatedSignature.equals(signatureHeader)) {
			throw new InvalidOperationException("Webhook signature verification failed!!");
		}

		JSONObject event = new JSONObject(rawPayload);
		String eventType = event.getString("event");

		if (!"payment.captured".equals(eventType)) {
			log.info("Ignoring webhook event type: {}", eventType);
			return;
		}

		JSONObject paymentEntity = event.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
		String razorpayOrderId = paymentEntity.getString("order_id");
		String razorpayPaymentId = paymentEntity.getString("id");

		Payments payment = paymentRepo.findByRazorpayOrderId(razorpayOrderId);
		if (payment == null || payment.getStatus() == PaymentStatus.SUCCESS) {
			log.info("Webhook: payment already processed or not found for RazorpayOrderId: {}", razorpayOrderId);
			return;
		}

		payment.setTransactionId(razorpayPaymentId);
		payment.setStatus(PaymentStatus.SUCCESS);
		paymentRepo.save(payment);

		Orders order = payment.getOrder();
		order.setPaymentStatus(Orders.PaymentStatus.SUCCESS);
		orderRepo.save(order);

		log.info("Webhook processed successfully for RazorpayOrderId: {}", razorpayOrderId);
	}
	
	
	
	
	
	//helperMethod
	private String generateHmacSha256(String data, String secret) throws Exception {
		Mac sha256Hmac = Mac.getInstance("HmacSHA256");
		SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		sha256Hmac.init(secretKey);
		byte[] hash = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

		StringBuilder hexString = new StringBuilder();
		for (byte b : hash) {
			String hex = Integer.toHexString(0xff & b);
			if (hex.length() == 1) hexString.append('0');
			hexString.append(hex);
		}
		return hexString.toString();
	}
	
	
	

}
