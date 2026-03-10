package com.example.memoapp.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record FinanceRecord(
        Long id,
        String month,
        String type,
        BigDecimal amount,
        String note,
        OffsetDateTime createdAt
) {
}
