package com.example.memoapp.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateMemoRequest(@NotBlank(message = "备忘内容不能为空") String content) {
}
