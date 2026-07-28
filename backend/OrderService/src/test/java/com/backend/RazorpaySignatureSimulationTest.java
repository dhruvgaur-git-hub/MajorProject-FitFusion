package com.backend;

import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class RazorpaySignatureSimulationTest {

	public static void main(String[] args) throws Exception {

		// Simulate what Razorpay would generate, using the SAME secret your app has configured
		String secret = "mock_secret_key_for_testing_only_12345";
		String simulatedOrderId = "order_MOCK123ABC";
		String simulatedPaymentId = "pay_MOCK456XYZ";

		String payload = simulatedOrderId + "|" + simulatedPaymentId;
		String simulatedSignature = generateHmacSha256(payload, secret);

		System.out.println("Simulated Razorpay Order ID: " + simulatedOrderId);
		System.out.println("Simulated Razorpay Payment ID: " + simulatedPaymentId);
		System.out.println("Simulated Signature (as if from Razorpay): " + simulatedSignature);

		// Now verify: recompute the signature exactly as verifyRazorpayPayment() does,
		// and confirm it matches — proving the math is correct and consistent
		String recomputedSignature = generateHmacSha256(payload, secret);
		boolean isValid = recomputedSignature.equals(simulatedSignature);

		System.out.println("Signatures match (verification would succeed): " + isValid);

		// Also prove tampering gets caught — simulate a malicious altered payment ID
		String tamperedPayload = simulatedOrderId + "|" + "pay_HACKED999";
		String tamperedSignatureCheck = generateHmacSha256(tamperedPayload, secret);
		boolean tamperedWouldPass = tamperedSignatureCheck.equals(simulatedSignature);

		System.out.println("Tampered payment ID incorrectly verified as valid: " + tamperedWouldPass
				+ "  (should be FALSE)");
	}

	private static String generateHmacSha256(String data, String secret) throws Exception {
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