-- Completely disable RLS on all tables
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
DROP POLICY IF EXISTS "basic_users_policy" ON users;
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
DROP POLICY IF EXISTS "users_delete" ON users;

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
DROP POLICY IF EXISTS "roles_select" ON roles;
DROP POLICY IF EXISTS "roles_insert" ON roles;
DROP POLICY IF EXISTS "roles_update" ON roles;
DROP POLICY IF EXISTS "roles_delete" ON roles;

DROP POLICY IF EXISTS "Branches are viewable by authenticated users" ON branches;
DROP POLICY IF EXISTS "Admins can manage branches" ON branches;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON branches;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON branches;
DROP POLICY IF EXISTS "basic_branches_policy" ON branches;
DROP POLICY IF EXISTS "branches_select" ON branches;
DROP POLICY IF EXISTS "branches_insert" ON branches;
DROP POLICY IF EXISTS "branches_update" ON branches;
DROP POLICY IF EXISTS "branches_delete" ON branches;

DROP POLICY IF EXISTS "Teams are viewable by authenticated users" ON teams;
DROP POLICY IF EXISTS "Admins and managers can manage teams" ON teams;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON teams;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON teams;
DROP POLICY IF EXISTS "basic_teams_policy" ON teams;
DROP POLICY IF EXISTS "teams_select" ON teams;
DROP POLICY IF EXISTS "teams_insert" ON teams;
DROP POLICY IF EXISTS "teams_update" ON teams;
DROP POLICY IF EXISTS "teams_delete" ON teams;

-- Drop any existing functions
DROP FUNCTION IF EXISTS is_admin(uuid);
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS check_user_auth();

-- Grant necessary permissions to authenticated users
GRANT ALL ON users TO authenticated;
GRANT ALL ON roles TO authenticated;
GRANT ALL ON branches TO authenticated;
GRANT ALL ON teams TO authenticated;
