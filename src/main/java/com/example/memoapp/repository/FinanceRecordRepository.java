package com.example.memoapp.repository;

import com.example.memoapp.model.FinanceRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class FinanceRecordRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<FinanceRecord> recordRowMapper = (rs, rowNum) -> new FinanceRecord(
            rs.getLong("id"),
            rs.getString("month"),
            rs.getString("type"),
            rs.getBigDecimal("amount"),
            rs.getString("note"),
            rs.getObject("created_at", java.time.OffsetDateTime.class)
    );

    public FinanceRecordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FinanceRecord> findByMonth(String month) {
        return jdbcTemplate.query(
                "SELECT id, month, type, amount, note, created_at FROM finance_records WHERE month = ? ORDER BY created_at DESC",
                recordRowMapper,
                month
        );
    }

    public FinanceRecord create(String month, String type, BigDecimal amount, String note) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO finance_records(month, type, amount, note) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, month);
            ps.setString(2, type);
            ps.setBigDecimal(3, amount);
            ps.setString(4, note);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long id = key == null ? null : key.longValue();
        return jdbcTemplate.queryForObject(
                "SELECT id, month, type, amount, note, created_at FROM finance_records WHERE id = ?",
                recordRowMapper,
                id
        );
    }

    public boolean deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM finance_records WHERE id = ?", id) > 0;
    }
}
