CREATE TABLE invite_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token         VARCHAR(64) UNIQUE NOT NULL,
  user_name     VARCHAR(255) NOT NULL,
  token_budget  INTEGER NOT NULL,
  tokens_used   INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE usage_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id     UUID NOT NULL REFERENCES invite_links(id),
  persona_slug  VARCHAR(64) NOT NULL,
  input_tokens  INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_invite ON usage_log(invite_id);
CREATE INDEX idx_invite_token ON invite_links(token);
