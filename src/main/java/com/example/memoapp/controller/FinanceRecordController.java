package com.example.memoapp.controller;

import com.example.memoapp.dto.CreateRecordRequest;
import com.example.memoapp.model.FinanceRecord;
import com.example.memoapp.repository.FinanceRecordRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/records")
public class FinanceRecordController {
    private final FinanceRecordRepository recordRepository;

    public FinanceRecordController(FinanceRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }

    @GetMapping
    public List<FinanceRecord> getRecords(@RequestParam String month) {
        return recordRepository.findByMonth(month);
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
}
