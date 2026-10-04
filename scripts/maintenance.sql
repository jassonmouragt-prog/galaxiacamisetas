DELETE FROM sessions WHERE expires_at < now();
DELETE FROM rate_limits WHERE reset_at < now() - interval '1 day';
