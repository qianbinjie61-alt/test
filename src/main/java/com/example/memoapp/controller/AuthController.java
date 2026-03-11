package com.example.memoapp.controller;

import com.example.memoapp.dto.LoginRequest;
import com.example.memoapp.dto.LoginResponse;
import com.example.memoapp.dto.RegisterRequest;
import com.example.memoapp.dto.UserResponse;
import com.example.memoapp.model.User;
import com.example.memoapp.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        AuthService.AuthResult result = authService.login(request.username(), request.password());
        User user = result.user();
        return new LoginResponse(result.token(), user.username(), user.role(), user.status());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request.username(), request.password());
        return new UserResponse(user.id(), user.username(), user.role(), user.status());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = "Authorization", required = false) String authorization,
                       @RequestHeader(value = "X-Auth-Token", required = false) String tokenHeader) {
        authService.logout(extractToken(authorization, tokenHeader));
    }

    @GetMapping("/me")
    public UserResponse me(@RequestAttribute("authUser") User user) {
        return new UserResponse(user.id(), user.username(), user.role(), user.status());
    }

    private String extractToken(String authorization, String tokenHeader) {
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }
        return tokenHeader;
    }
}
