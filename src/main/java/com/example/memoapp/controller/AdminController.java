package com.example.memoapp.controller;

import com.example.memoapp.dto.UserResponse;
import com.example.memoapp.model.User;
import com.example.memoapp.repository.UserRepository;
import com.example.memoapp.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final AuthService authService;

    public AdminController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/users/pending")
    public List<UserResponse> pendingUsers(@RequestAttribute("authUser") User user) {
        requireAdmin(user);
        return userRepository.findByStatus(AuthService.STATUS_PENDING).stream()
                .map(u -> new UserResponse(u.id(), u.username(), u.role(), u.status()))
                .toList();
    }

    @GetMapping("/users")
    public List<UserResponse> allUsers(@RequestAttribute("authUser") User user) {
        requireAdmin(user);
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.id(), u.username(), u.role(), u.status()))
                .toList();
    }

    @PostMapping("/users/{id}/role")
    public UserResponse updateRole(
            @RequestAttribute("authUser") User user,
            @PathVariable Long id,
            @RequestParam String role
    ) {
        requireAdmin(user);
        String normalized = role == null ? "" : role.trim().toUpperCase();
        if (!AuthService.ROLE_ADMIN.equals(normalized) && !AuthService.ROLE_USER.equals(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid role");
        }
        if (!userRepository.updateRole(id, normalized)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        User updated = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));
        return new UserResponse(updated.id(), updated.username(), updated.role(), updated.status());
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@RequestAttribute("authUser") User user, @PathVariable Long id) {
        requireAdmin(user);
        if (user.id().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cannot delete self");
        }
        if (!userRepository.deleteById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
    }

    @PostMapping("/users/{id}/approve")
    public UserResponse approve(@RequestAttribute("authUser") User user, @PathVariable Long id) {
        requireAdmin(user);
        if (!userRepository.updateStatus(id, AuthService.STATUS_ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        User updated = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));
        return new UserResponse(updated.id(), updated.username(), updated.role(), updated.status());
    }

    @PostMapping("/users/{id}/reject")
    public UserResponse reject(@RequestAttribute("authUser") User user, @PathVariable Long id) {
        requireAdmin(user);
        if (!userRepository.updateStatus(id, AuthService.STATUS_REJECTED)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        User updated = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));
        return new UserResponse(updated.id(), updated.username(), updated.role(), updated.status());
    }

    private void requireAdmin(User user) {
        if (!authService.isAdmin(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "forbidden");
        }
    }
}
