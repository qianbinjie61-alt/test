package com.example.memoapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record CreateRecordRequest(
        @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "鏈堜唤鏍煎紡蹇呴』鏄?YYYY-MM") String month,
        @Pattern(regexp = "^(income|expense)$", message = "绫诲瀷蹇呴』鏄?income 鎴?expense") String type,
        @DecimalMin(value = "0.0", inclusive = true, message = "閲戰蹇呴』澶т簬绛変簬 0") BigDecimal amount,
        @NotBlank(message = "璇存槑涓嶈兘涓虹┖") String note,
        @NotBlank(message = "璁板綍鏃ユ湡涓嶈兘涓虹┖")
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "璁板綍鏃ユ湡鏍煎紡蹇呴』鏄?YYYY-MM-DD")
        String recordDate
) {
}
