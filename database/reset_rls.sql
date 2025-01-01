-- First, completely disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON users;

DROP POLICY IF EXISTS "Roles are viewable by everyone" ON roles;
DROP POLICY IF EXISTS "Roles can be created by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be updated by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be deleted by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON roles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to manage roles" ON roles;

DROP POLICY IF EXISTS "Branches are viewable by authenticated users" ON branches;
DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON branches;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON branches;

DROP POLICY IF EXISTS "Teams are viewable by authenticated users" ON teams;
DROP POLICY IF EXISTS "Admins and managers can manage teams" ON teams;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON teams;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON teams;

-- Drop any existing functions that might be causing issues
DROP FUNCTION IF EXISTS is_admin(uuid);

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create the most basic policies possible
CREATE POLICY "basic_users_policy" ON users
    FOR ALL
    USING (true);

CREATE POLICY "basic_roles_policy" ON roles
    FOR ALL
    USING (true);

CREATE POLICY "basic_branches_policy" ON branches
    FOR ALL
    USING (true);

CREATE POLICY "basic_teams_policy" ON teams
    FOR ALL
    USING (true);
