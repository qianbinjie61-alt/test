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
import java.util.Optional;

@Repository
public class FinanceRecordRepository {
    private final JdbcTemplate jdbcTemplate;

    public record MonthTotals(BigDecimal incomeTotal, BigDecimal expenseTotal) {
    }

    private final RowMapper<FinanceRecord> recordRowMapper = (rs, rowNum) -> new FinanceRecord(
            rs.getLong("id"),
            rs.getString("month"),
            rs.getString("type"),
            rs.getBigDecimal("amount"),
            rs.getString("note"),
            rs.getObject("record_date", java.time.LocalDate.class),
            rs.getObject("created_at", java.time.OffsetDateTime.class)
    );

    public FinanceRecordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FinanceRecord> findByMonth(String month) {
        return jdbcTemplate.query(
                "SELECT id, month, type, amount, note, record_date, created_at FROM finance_records WHERE month = ? ORDER BY created_at DESC",
                recordRowMapper,
                month
        );
    }

    public List<FinanceRecord> findByMonthPage(String month, int size, long offset) {
        return jdbcTemplate.query(
                "SELECT id, month, type, amount, note, record_date, created_at FROM finance_records WHERE month = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
                recordRowMapper,
                month,
                size,
                offset
        );
    }

    public long countByMonth(String month) {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM finance_records WHERE month = ?", Long.class, month);
        return count == null ? 0L : count;
    }

    public MonthTotals totalsByMonth(String month) {
        return jdbcTemplate.queryForObject(
                """
                SELECT
                  COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS income_total,
                  COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS expense_total
                FROM finance_records
                WHERE month = ?
                """,
                (rs, rowNum) -> new MonthTotals(
                        rs.getBigDecimal("income_total"),
                        rs.getBigDecimal("expense_total")
                ),
                month
        );
    }

    public Optional<FinanceRecord> findById(Long id) {
        List<FinanceRecord> rows = jdbcTemplate.query(
                "SELECT id, month, type, amount, note, record_date, created_at FROM finance_records WHERE id = ?",
                recordRowMapper,
                id
        );
        return rows.stream().findFirst();
    }

    public FinanceRecord create(String month, String type, BigDecimal amount, String note, java.time.LocalDate recordDate) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO finance_records(month, type, amount, note, record_date) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, month);
            ps.setString(2, type);
            ps.setBigDecimal(3, amount);
            ps.setString(4, note);
            ps.setObject(5, recordDate);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long id = key == null ? null : key.longValue();
        return findById(id).orElseThrow();
    }

    public boolean updateRecord(Long id, String month, String type, BigDecimal amount, String note, java.time.LocalDate recordDate) {
        return jdbcTemplate.update(
                "UPDATE finance_records SET month = ?, type = ?, amount = ?, note = ?, record_date = ? WHERE id = ?",
                month,
                type,
                amount,
                note,
                recordDate,
                id
        ) > 0;
    }

    public boolean deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM finance_records WHERE id = ?", id) > 0;
    }
}
