package com.example.memoapp.dto;

import com.example.memoapp.model.FinanceRecord;

import java.math.BigDecimal;
import java.util.List;

public record RecordsPageResponse(
        List<FinanceRecord> items,
        int page,
        int size,
        long total,
        BigDecimal incomeTotal,
        BigDecimal expenseTotal
) {
}

