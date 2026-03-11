package com.example.memoapp.repository;

import com.example.memoapp.model.Memo;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class MemoRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Memo> memoRowMapper = (rs, rowNum) -> new Memo(
            rs.getLong("id"),
            rs.getString("content"),
            rs.getObject("created_at", java.time.OffsetDateTime.class)
    );

    public MemoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Memo> findAll() {
        return jdbcTemplate.query("SELECT id, content, created_at FROM memos ORDER BY created_at DESC", memoRowMapper);
    }

    public List<Memo> findPage(int size, long offset) {
        return jdbcTemplate.query(
                "SELECT id, content, created_at FROM memos ORDER BY created_at DESC LIMIT ? OFFSET ?",
                memoRowMapper,
                size,
                offset
        );
    }

    public long countAll() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM memos", Long.class);
        return count == null ? 0L : count;
    }

    public Optional<Memo> findById(Long id) {
        List<Memo> rows = jdbcTemplate.query(
                "SELECT id, content, created_at FROM memos WHERE id = ?",
                memoRowMapper,
                id
        );
        return rows.stream().findFirst();
    }

    public Memo create(String content) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO memos(content) VALUES (?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, content);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long id = key == null ? null : key.longValue();
        return findById(id).orElseThrow();
    }

    public boolean updateContent(Long id, String content) {
        return jdbcTemplate.update("UPDATE memos SET content = ? WHERE id = ?", content, id) > 0;
    }

    public boolean deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM memos WHERE id = ?", id) > 0;
    }
}
