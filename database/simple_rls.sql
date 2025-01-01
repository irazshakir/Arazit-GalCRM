-- First disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Roles viewable by authenticated users" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Branches viewable by authenticated users" ON branches;
DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Teams viewable by authenticated users" ON teams;
DROP POLICY IF EXISTS "Admins can manage teams" ON teams;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Simple policies that just check if user is authenticated
CREATE POLICY "Enable read access for authenticated users" ON users
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON roles
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON branches
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON teams
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Enable all operations for authenticated users (temporary for testing)
CREATE POLICY "Enable all access for authenticated users" ON users
    FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON roles
    FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON branches
    FOR ALL
    USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON teams
    FOR ALL
    USING (auth.role() = 'authenticated');
