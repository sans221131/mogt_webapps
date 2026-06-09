CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS project_intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  intent TEXT NOT NULL DEFAULT 'start_project',

  project_type TEXT NOT NULL,

  services_needed TEXT[] NOT NULL DEFAULT '{}',

  timeline TEXT,

  reference_links TEXT[] NOT NULL DEFAULT '{}',

  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  preferred_contact_method TEXT DEFAULT 'email',

  source_page TEXT,
  source_button TEXT,
  user_agent TEXT,

  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT project_intake_contact_required
    CHECK (
      email IS NOT NULL
      OR phone IS NOT NULL
    )
);

CREATE INDEX IF NOT EXISTS project_intake_submissions_created_at_idx
  ON project_intake_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS project_intake_submissions_status_idx
  ON project_intake_submissions (status);

CREATE INDEX IF NOT EXISTS project_intake_submissions_project_type_idx
  ON project_intake_submissions (project_type);

CREATE INDEX IF NOT EXISTS project_intake_submissions_intent_idx
  ON project_intake_submissions (intent);

CREATE OR REPLACE FUNCTION set_project_intake_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS project_intake_submissions_updated_at
  ON project_intake_submissions;

CREATE TRIGGER project_intake_submissions_updated_at
BEFORE UPDATE ON project_intake_submissions
FOR EACH ROW
EXECUTE FUNCTION set_project_intake_updated_at();
