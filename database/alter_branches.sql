-- Add branch_is_active column to branches table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'branches' AND column_name = 'branch_is_active') THEN
        ALTER TABLE branches ADD COLUMN branch_is_active BOOLEAN DEFAULT true;
    END IF;
END $$;
