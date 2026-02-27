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
        return jdbcTemplate.queryForObject(
                "SELECT id, content, created_at FROM memos WHERE id = ?",
                memoRowMapper,
                id
        );
    }

    public boolean deleteById(Long id) {
        return jdbcTemplate.update("DELETE FROM memos WHERE id = ?", id) > 0;
    }
}
