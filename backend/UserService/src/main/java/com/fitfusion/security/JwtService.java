package com.fitfusion.security;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fitfusion.userservice.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@Service
public class JwtService {
	@Value("${jwt.secret}")
	private String secretKey;
	@Value("${jwt.expiration}")
	private long jwtExpiration;
	private SecretKey getSigningKey() {
	    return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

	/*
	 * public String generateToken(UserDetails userDetails) {
	 * 
	 * return Jwts.builder() .subject(userDetails.getUsername()) .issuedAt(new
	 * Date()) .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
	 * .signWith(getSigningKey()) .compact(); }
	 */
	public String generateToken(User user) {
	    return Jwts.builder()
	            .subject(user.getEmail())
	            .claim("userId", user.getUserId())
	            .claim("role", user.getRole().name())
	            .issuedAt(new Date())
	            .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
	            .signWith(getSigningKey())
	            .compact();
	}
	
	
	
    // Extract email(username) from JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract expiry date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic method to extract any claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {

        final Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    // Parse token and return all claims
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Check expiry
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Validate token
    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }
}
