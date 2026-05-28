-- ============================================================
--  Formelsammlung – Supabase Setup
--  Diesen SQL-Code im Supabase SQL-Editor ausführen
-- ============================================================

-- 1) Formeln-Tabelle
CREATE TABLE IF NOT EXISTS formulas (
  id           TEXT PRIMARY KEY,
  name         TEXT        NOT NULL,
  category     TEXT        NOT NULL,
  subcategory  TEXT        NOT NULL,
  description  TEXT        NOT NULL DEFAULT '',
  variables    JSONB       NOT NULL DEFAULT '{}',
  forms        JSONB       NOT NULL DEFAULT '{}',
  default_var  TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Favoriten-Tabelle (pro Benutzer)
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  formula_id  TEXT        NOT NULL REFERENCES formulas(id)  ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, formula_id)
);

-- 3) Row Level Security aktivieren
ALTER TABLE formulas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 4) Policies
--    Formeln: jeder kann lesen
CREATE POLICY "Formeln öffentlich lesbar"
  ON formulas FOR SELECT
  USING (true);

--    Formeln: nur eigener Insert (für die Erstbefüllung aus dem Browser)
CREATE POLICY "Formeln insertierbar"
  ON formulas FOR INSERT
  WITH CHECK (true);

--    Favoriten: nur eigene Einträge sichtbar / veränderbar
CREATE POLICY "Nur eigene Favoriten"
  ON favorites FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
