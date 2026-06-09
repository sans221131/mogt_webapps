ALTER TABLE project_intake_submissions
  DROP COLUMN IF EXISTS project_stage,
  DROP COLUMN IF EXISTS budget_currency,
  DROP COLUMN IF EXISTS budget_range,
  DROP COLUMN IF EXISTS project_brief;
