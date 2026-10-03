ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "academicBranch" text,
  ADD COLUMN IF NOT EXISTS "graduationYear" text,
  ADD COLUMN IF NOT EXISTS "technicalInterests" text,
  ADD COLUMN IF NOT EXISTS "profilePublic" boolean NOT NULL DEFAULT true;
