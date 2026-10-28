package com.example.demo.dto;

public class AuthResponseDto {
    private String accessToken;
    private String role;
    private String username;
    public AuthResponseDto() {
    }
    public AuthResponseDto(String accessToken, String role, String username) {
        this.accessToken = accessToken;
        this.role = role;
        this.username = username;
    }
    public String getAccessToken() {
        return accessToken;
    }
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    
}
