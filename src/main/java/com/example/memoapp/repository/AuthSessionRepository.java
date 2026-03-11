package com.example.memoapp.repository;

import com.example.memoapp.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class AuthSessionRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = (rs, rowNum) -> new User(
            rs.getLong("id"),
            rs.getString("username"),
            rs.getString("password_hash"),
            rs.getString("role"),
            rs.getString("status"),
            rs.getObject("created_at", java.time.OffsetDateTime.class)
    );

    public AuthSessionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createSession(Long userId, String token, OffsetDateTime expiresAt) {
        jdbcTemplate.update(
                "INSERT INTO auth_sessions(user_id, token, expires_at) VALUES (?, ?, ?)",
                userId,
                token,
                expiresAt
        );
    }

    public Optional<User> findUserByToken(String token) {
        List<User> rows = jdbcTemplate.query(
                """
                SELECT u.id, u.username, u.password_hash, u.role, u.status, u.created_at
                FROM auth_sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token = ? AND s.expires_at > NOW()
                """,
                userRowMapper,
                token
        );
        return rows.stream().findFirst();
    }

    public int deleteByToken(String token) {
        return jdbcTemplate.update("DELETE FROM auth_sessions WHERE token = ?", token);
    }
}
