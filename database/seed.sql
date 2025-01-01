-- First, let's ensure we have the Admin role
INSERT INTO roles (id, role_name, role_is_active, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Admin',
    true,
    TIMEZONE('utc', NOW())
) ON CONFLICT (role_name) DO NOTHING;

-- Then, let's ensure we have a main branch
INSERT INTO branches (
    id,
    branch_name,
    branch_city,
    branch_email,
    branch_phone,
    branch_address,
    created_at
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Main Branch',
    'Main City',
    'branch@arazit.com',
    '+1234567890',
    'Main Address',
    TIMEZONE('utc', NOW())
) ON CONFLICT (id) DO NOTHING;

-- Create admin user if not exists
INSERT INTO users (
    id,
    email,
    name,
    role_id,
    branch_id,
    user_is_active,
    email_verified,
    email_verified_at,
    created_at,
    updated_at
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'arazitdigital@gmail.com',
    'admin',
    '00000000-0000-0000-0000-000000000001', -- Admin role ID
    '00000000-0000-0000-0000-000000000001', -- Main branch ID
    true,
    false,
    NULL,
    TIMEZONE('utc', NOW()),
    TIMEZONE('utc', NOW())
) ON CONFLICT (email) DO NOTHING;