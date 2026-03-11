package com.example.memoapp.service;

import com.example.memoapp.model.User;
import com.example.memoapp.repository.AuthSessionRepository;
import com.example.memoapp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    public record AuthResult(String token, User user) {
    }

    private final UserRepository userRepository;
    private final AuthSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final int sessionHours;

    public AuthService(
            UserRepository userRepository,
            AuthSessionRepository sessionRepository,
            PasswordEncoder passwordEncoder,
            @org.springframework.beans.factory.annotation.Value("${app.auth.session-hours:12}") int sessionHours
    ) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionHours = sessionHours;
    }

    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_REJECTED = "REJECTED";

    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("username already exists");
        }
        long adminCount = userRepository.countByRole(ROLE_ADMIN);
        String role = adminCount == 0 ? ROLE_ADMIN : ROLE_USER;
        String status = adminCount == 0 ? STATUS_ACTIVE : STATUS_PENDING;
        String hash = passwordEncoder.encode(password);
        return userRepository.create(username, hash, role, status);
    }

    public AuthResult login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("invalid credentials"));
        if (!passwordEncoder.matches(password, user.passwordHash())) {
            throw new IllegalArgumentException("invalid credentials");
        }
        if (!STATUS_ACTIVE.equalsIgnoreCase(user.status())) {
            throw new IllegalArgumentException("account not approved");
        }
        String token = UUID.randomUUID().toString();
        OffsetDateTime expiresAt = OffsetDateTime.now().plusHours(sessionHours);
        sessionRepository.createSession(user.id(), token, expiresAt);
        return new AuthResult(token, user);
    }

    public Optional<User> authenticate(String token) {
        if (token == null || token.isBlank()) return Optional.empty();
        Optional<User> user = sessionRepository.findUserByToken(token);
        if (user.isEmpty()) return Optional.empty();
        return STATUS_ACTIVE.equalsIgnoreCase(user.get().status()) ? user : Optional.empty();
    }

    public void logout(String token) {
        if (token == null || token.isBlank()) return;
        sessionRepository.deleteByToken(token);
    }

    public boolean isAdmin(User user) {
        return user != null && ROLE_ADMIN.equalsIgnoreCase(user.role());
    }
}
