CREATE TABLE IF NOT EXISTS administrators (
 id uuid PRIMARY KEY, email text UNIQUE NOT NULL, password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY, administrator_id uuid NOT NULL REFERENCES administrators(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY, attempts integer NOT NULL DEFAULT 1, reset_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS settings (
 id integer PRIMARY KEY CHECK (id = 1), data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO settings(id,data) VALUES (1,'{"enabled":false,"whatsapp":"","minimumQuantity":10,"productionDays":15,"validityDays":7,"artFeeCents":0,"models":[],"prints":[],"discounts":[]}') ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS customers (
 id uuid PRIMARY KEY, name text NOT NULL, phone text UNIQUE NOT NULL, city text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE SEQUENCE IF NOT EXISTS quote_number;
CREATE TABLE IF NOT EXISTS quotes (
 id uuid PRIMARY KEY, number bigint NOT NULL UNIQUE DEFAULT nextval('quote_number'), public_token text UNIQUE NOT NULL,
 request_key uuid UNIQUE NOT NULL, customer_id uuid NOT NULL REFERENCES customers(id),
 status text NOT NULL DEFAULT 'NOVO' CHECK(status IN ('NOVO','EM_CONTATO','APROVADO','PERDIDO')),
 details jsonb NOT NULL, pricing jsonb NOT NULL, total_cents integer NOT NULL CHECK(total_cents >= 0),
 delivery_date date NOT NULL, event_date date NOT NULL, valid_until timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE SEQUENCE IF NOT EXISTS order_number;
CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY, number bigint UNIQUE NOT NULL DEFAULT nextval('order_number'), quote_id uuid UNIQUE NOT NULL REFERENCES quotes(id),
 status text NOT NULL DEFAULT 'AGUARDANDO_ARTE' CHECK(status IN ('AGUARDANDO_ARTE','ARTE_APROVADA','EM_PRODUCAO','PRONTO','ENTREGUE','CANCELADO')),
 delivery_date date NOT NULL, notes text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS followups (
 id uuid PRIMARY KEY, quote_id uuid NOT NULL REFERENCES quotes(id) ON DELETE CASCADE, due_at timestamptz NOT NULL, note text NOT NULL, done boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_events (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, administrator_id uuid REFERENCES administrators(id), entity_id uuid, action text NOT NULL, details jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quotes_created_idx ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS orders_delivery_idx ON orders(delivery_date);
CREATE INDEX IF NOT EXISTS followups_due_idx ON followups(due_at) WHERE done = false;
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
