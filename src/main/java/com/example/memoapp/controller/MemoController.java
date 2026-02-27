package com.example.memoapp.controller;

import com.example.memoapp.dto.CreateMemoRequest;
import com.example.memoapp.model.Memo;
import com.example.memoapp.repository.MemoRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memos")
public class MemoController {
    private final MemoRepository memoRepository;

    public MemoController(MemoRepository memoRepository) {
        this.memoRepository = memoRepository;
    }

    @GetMapping
    public List<Memo> getMemos() {
        return memoRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Memo createMemo(@Valid @RequestBody CreateMemoRequest request) {
        return memoRepository.create(request.content().trim());
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deleteMemo(@PathVariable Long id) {
        boolean deleted = memoRepository.deleteById(id);
        if (!deleted) {
            throw new ResourceNotFoundException("备忘不存在");
        }
        return Map.of("ok", true);
    }
}
