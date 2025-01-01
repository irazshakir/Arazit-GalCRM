-- First, disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users are viewable by authenticated users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON users;
DROP POLICY IF EXISTS "basic_users_policy" ON users;

DROP POLICY IF EXISTS "Roles are viewable by everyone" ON roles;
DROP POLICY IF EXISTS "Roles can be created by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be updated by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be deleted by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles are viewable by authenticated users" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON roles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to manage roles" ON roles;
DROP POLICY IF EXISTS "basic_roles_policy" ON roles;

-- Drop any existing functions
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS check_user_auth();

-- Create helper function for authentication check
CREATE OR REPLACE FUNCTION check_user_auth()
RETURNS BOOLEAN AS $$
BEGIN
    -- First check if authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    -- Then check if user exists in our users table
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND user_is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function for admin check
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- First check authentication
    IF NOT check_user_auth() THEN
        RETURN FALSE;
    END IF;
    -- Then check admin role
    RETURN EXISTS (
        SELECT 1 FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = auth.uid()
        AND r.role_name IN ('Super Admin', 'Admin')
        AND u.user_is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Users Policies - Separate policies for different operations
CREATE POLICY "users_select" ON users
    FOR SELECT
    USING (check_user_auth());

CREATE POLICY "users_insert" ON users
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "users_update" ON users
    FOR UPDATE
    USING (
        is_admin() -- Admins can update any user
        OR 
        (check_user_auth() AND id = auth.uid()) -- Users can update themselves
    );

CREATE POLICY "users_delete" ON users
    FOR DELETE
    USING (is_admin());

-- Roles Policies - Separate policies for different operations
CREATE POLICY "roles_select" ON roles
    FOR SELECT
    USING (check_user_auth());

CREATE POLICY "roles_insert" ON roles
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "roles_update" ON roles
    FOR UPDATE
    USING (is_admin());

CREATE POLICY "roles_delete" ON roles
    FOR DELETE
    USING (is_admin());

-- Branches Policies
CREATE POLICY "branches_select" ON branches
    FOR SELECT
    USING (check_user_auth());

CREATE POLICY "branches_insert" ON branches
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "branches_update" ON branches
    FOR UPDATE
    USING (is_admin());

CREATE POLICY "branches_delete" ON branches
    FOR DELETE
    USING (is_admin());

-- Teams Policies
CREATE POLICY "teams_select" ON teams
    FOR SELECT
    USING (check_user_auth());

CREATE POLICY "teams_insert" ON teams
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "teams_update" ON teams
    FOR UPDATE
    USING (is_admin());

CREATE POLICY "teams_delete" ON teams
    FOR DELETE
    USING (is_admin());
