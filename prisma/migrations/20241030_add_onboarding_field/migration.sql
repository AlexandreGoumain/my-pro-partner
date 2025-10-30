-- Add onboardingComplete field to User table
DO $$
BEGIN
    -- Add column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'User' AND column_name = 'onboardingComplete'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;
