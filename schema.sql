CREATE TABLE reminders (
    discord_id bigint NOT NULL,
    reminder varchar NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);