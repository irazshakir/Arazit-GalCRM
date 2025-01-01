-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Roles are viewable by everyone" ON roles;
DROP POLICY IF EXISTS "Roles can be created by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be updated by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be deleted by authenticated users" ON roles;

-- Users Policies
-- Everyone can view active users
CREATE POLICY "Users are viewable by authenticated users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Users can update their own data
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admin users can create/update/delete any user
CREATE POLICY "Admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()
            AND r.role_name IN ('Super Admin', 'Admin')
        )
    );

-- Roles Policies
-- All authenticated users can view roles
CREATE POLICY "Roles are viewable by authenticated users" ON roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin users can manage roles
CREATE POLICY "Admins can manage roles" ON roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()
            AND r.role_name IN ('Super Admin', 'Admin')
        )
    );

-- Branches Policies
-- All authenticated users can view branches
CREATE POLICY "Branches are viewable by authenticated users" ON branches
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin users can manage branches
CREATE POLICY "Admins can manage branches" ON branches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()
            AND r.role_name IN ('Super Admin', 'Admin')
        )
    );

-- Teams Policies
-- All authenticated users can view teams
CREATE POLICY "Teams are viewable by authenticated users" ON teams
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admin users and team managers can manage teams
CREATE POLICY "Admins and managers can manage teams" ON teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = auth.uid()
            AND r.role_name IN ('Super Admin', 'Admin', 'Team Manager')
        )
    );
