package com.example.memoapp.controller;

import com.example.memoapp.dto.CreateRecordRequest;
import com.example.memoapp.dto.RecordsPageResponse;
import com.example.memoapp.model.FinanceRecord;
import com.example.memoapp.repository.FinanceRecordRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/records")
public class FinanceRecordController {
    private final FinanceRecordRepository recordRepository;

    public FinanceRecordController(FinanceRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @GetMapping
    public RecordsPageResponse getRecords(
            @RequestParam String month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (month == null || month.isBlank()) throw new IllegalArgumentException("month is required");
        validatePagination(page, size);

        long total = recordRepository.countByMonth(month);
        FinanceRecordRepository.MonthTotals totals = recordRepository.totalsByMonth(month);
        long offset = (long) page * (long) size;
        return new RecordsPageResponse(
                recordRepository.findByMonthPage(month, size, offset),
                page,
                size,
                total,
                totals.incomeTotal(),
                totals.expenseTotal()
        );
    }

    @GetMapping("/{id}")
    public FinanceRecord getRecord(@PathVariable Long id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("记录不存在"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FinanceRecord createRecord(@Valid @RequestBody CreateRecordRequest request) {
        return recordRepository.create(
                request.month(),
                request.type(),
                request.amount(),
                request.note().trim()
        );
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteRecord(@PathVariable Long id) {
        boolean deleted = recordRepository.deleteById(id);
        if (!deleted) {
            throw new ResourceNotFoundException("记录不存在");
        }
        return Map.of("ok", true);
    }

    private static void validatePagination(int page, int size) {
        if (page < 0) throw new IllegalArgumentException("page must be >= 0");
        if (size < 1) throw new IllegalArgumentException("size must be >= 1");
        if (size > 100) throw new IllegalArgumentException("size must be <= 100");
    }
}
