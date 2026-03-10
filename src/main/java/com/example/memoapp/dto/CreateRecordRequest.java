package com.example.memoapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record CreateRecordRequest(
        @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "月份格式必须是 YYYY-MM") String month,
        @Pattern(regexp = "^(income|expense)$", message = "类型必须是 income 或 expense") String type,
        @DecimalMin(value = "0.0", inclusive = true, message = "金额必须大于等于 0") BigDecimal amount,
        @NotBlank(message = "说明不能为空") String note
) {
}
