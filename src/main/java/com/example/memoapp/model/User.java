package com.example.memoapp.model;

import java.time.OffsetDateTime;

public record User(
        Long id,
        String username,
        String passwordHash,
        String role,
        String status,
        OffsetDateTime createdAt
) {
}
