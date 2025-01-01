-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all users
CREATE POLICY "Users can view all users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to insert their own record
CREATE POLICY "Users can insert their own record"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for authenticated users to update their own record
CREATE POLICY "Users can update their own record"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for admin users to manage all records
CREATE POLICY "Admins can manage all records"
ON users
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role_id = '00000000-0000-0000-0000-000000000001'
  )
);
