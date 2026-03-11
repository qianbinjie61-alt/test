package com.example.memoapp.repository;

import com.example.memoapp.model.User;
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
public class UserRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getLong("id"),
            rs.getString("username"),
            rs.getString("password_hash"),
            rs.getString("role"),
            rs.getString("status"),
            rs.getObject("created_at", java.time.OffsetDateTime.class)
    );

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<User> findByUsername(String username) {
        List<User> rows = jdbcTemplate.query(
                "SELECT id, username, password_hash, role, status, created_at FROM users WHERE username = ?",
                userRowMapper,
                username
        );
        return rows.stream().findFirst();
    }

    public Optional<User> findById(Long id) {
        List<User> rows = jdbcTemplate.query(
                "SELECT id, username, password_hash, role, status, created_at FROM users WHERE id = ?",
                userRowMapper,
                id
        );
        return rows.stream().findFirst();
    }

    public long countAll() {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", Long.class);
        return count == null ? 0L : count;
    }

    public long countByRole(String role) {
        Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE role = ?", Long.class, role);
        return count == null ? 0L : count;
    }

    public User create(String username, String passwordHash, String role, String status) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO users(username, password_hash, role, status) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, username);
            ps.setString(2, passwordHash);
            ps.setString(3, role);
            ps.setString(4, status);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long id = key == null ? null : key.longValue();
        return findById(id).orElseThrow();
    }

    public List<User> findByStatus(String status) {
        return jdbcTemplate.query(
                "SELECT id, username, password_hash, role, status, created_at FROM users WHERE status = ? ORDER BY created_at DESC",
                userRowMapper,
                status
        );
    }

    public boolean updateStatus(Long id, String status) {
        return jdbcTemplate.update("UPDATE users SET status = ? WHERE id = ?", status, id) > 0;
    }
}
