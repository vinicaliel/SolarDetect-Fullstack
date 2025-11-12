CREATE TABLE request_quotas (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    remaining_requests INT NOT NULL,
    last_reset_time TIMESTAMP NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE request_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    request_time TIMESTAMP NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);