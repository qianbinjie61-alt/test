package com.example.memoapp.controller;

import com.example.memoapp.dto.CreateMemoRequest;
import com.example.memoapp.dto.PageResponse;
import com.example.memoapp.model.Memo;
import com.example.memoapp.repository.MemoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/memos")
public class MemoController {
    private final MemoRepository memoRepository;

    public MemoController(MemoRepository memoRepository) {
        this.memoRepository = memoRepository;
    }

    @GetMapping
    public PageResponse<Memo> getMemos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        validatePagination(page, size);
        long total = memoRepository.countAll();
        long offset = (long) page * (long) size;
        return new PageResponse<>(memoRepository.findPage(size, offset), page, size, total);
    }

    @GetMapping("/{id}")
    public Memo getMemo(@PathVariable Long id) {
        return memoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("备忘不存在"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Memo createMemo(@Valid @RequestBody CreateMemoRequest request) {
        return memoRepository.create(request.content().trim());
    }

    @PutMapping("/{id}")
    public Memo updateMemo(@PathVariable Long id, @Valid @RequestBody CreateMemoRequest request) {
        String content = request.content().trim();
        boolean updated = memoRepository.updateContent(id, content);
        if (!updated) {
            throw new ResourceNotFoundException("澶囧繕涓嶅瓨鍦?");
        }
        return memoRepository.findById(id).orElseThrow();
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteMemo(@PathVariable Long id) {
        boolean deleted = memoRepository.deleteById(id);
        if (!deleted) {
            throw new ResourceNotFoundException("备忘不存在");
        }
        return Map.of("ok", true);
    }

    private static void validatePagination(int page, int size) {
        if (page < 0) throw new IllegalArgumentException("page must be >= 0");
        if (size < 1) throw new IllegalArgumentException("size must be >= 1");
        if (size > 100) throw new IllegalArgumentException("size must be <= 100");
    }
}
