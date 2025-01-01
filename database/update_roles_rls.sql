-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Roles are viewable by everyone" ON roles;
DROP POLICY IF EXISTS "Roles can be created by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be updated by authenticated users" ON roles;
DROP POLICY IF EXISTS "Roles can be deleted by authenticated users" ON roles;

-- Create new policies
-- Allow all authenticated users to view roles
CREATE POLICY "Roles are viewable by authenticated users" ON roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow only admin users to create roles
CREATE POLICY "Roles can be created by admin users" ON roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role_id IN (
                SELECT id FROM roles WHERE role_name IN ('Super Admin', 'Admin')
            )
        )
    );

-- Allow only admin users to update roles
CREATE POLICY "Roles can be updated by admin users" ON roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role_id IN (
                SELECT id FROM roles WHERE role_name IN ('Super Admin', 'Admin')
            )
        )
    );

-- Allow only admin users to delete roles
CREATE POLICY "Roles can be deleted by admin users" ON roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role_id IN (
                SELECT id FROM roles WHERE role_name IN ('Super Admin', 'Admin')
            )
        )
    );
