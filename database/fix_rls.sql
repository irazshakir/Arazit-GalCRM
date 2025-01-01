-- First, disable RLS temporarily to avoid any conflicts
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Branches are viewable by authenticated users" ON branches;
DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Teams are viewable by authenticated users" ON teams;
DROP POLICY IF EXISTS "Admins and managers can manage teams" ON teams;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users u 
        INNER JOIN roles r ON u.role_id = r.id 
        WHERE u.id = user_id 
        AND r.role_name IN ('Super Admin', 'Admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users viewable by authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (is_admin(auth.uid()));

-- Roles Policies
CREATE POLICY "Roles viewable by authenticated users" ON roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage roles" ON roles
    FOR ALL USING (is_admin(auth.uid()));

-- Branches Policies
CREATE POLICY "Branches viewable by authenticated users" ON branches
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage branches" ON branches
    FOR ALL USING (is_admin(auth.uid()));

-- Teams Policies
CREATE POLICY "Teams viewable by authenticated users" ON teams
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage teams" ON teams
    FOR ALL USING (is_admin(auth.uid()));
