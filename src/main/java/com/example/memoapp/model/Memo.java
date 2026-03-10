package com.example.memoapp.model;

import java.time.OffsetDateTime;

public record Memo(Long id, String content, OffsetDateTime createdAt) {
}
