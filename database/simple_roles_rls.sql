-- First disable RLS on roles table
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies on roles
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON roles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON roles;

-- Enable RLS on roles table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all operations for authenticated users
CREATE POLICY "Allow authenticated users to manage roles" ON roles
    FOR ALL
    USING (auth.role() = 'authenticated');
