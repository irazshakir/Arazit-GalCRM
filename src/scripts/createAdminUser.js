import { supabase } from '../config/supabase.js';

const createUser = async () => {
  try {
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'arazitdigital@gmail.com',
      password: 'password',
      options: {
        data: {
          name: 'araz',
          role: 'admin'
        }
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('User created in Auth:', authUser);

    // Now create or update the user in our database
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert({
        id: authUser.user.id,
        name: 'araz',
        email: 'arazitdigital@gmail.com',
        role_id: '00000000-0000-0000-0000-000000000001',
        branch_id: '00000000-0000-0000-0000-000000000001',
        user_is_active: true,
        email_verified: true,
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating database user:', dbError);
      return;
    }

    console.log('User created in Database:', dbUser);

    // Try to sign in immediately to test
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'arazitdigital@gmail.com',
      password: 'password'
    });

    if (signInError) {
      console.error('Error signing in:', signInError);
      return;
    }

    console.log('Successfully signed in:', signInData);

  } catch (error) {
    console.error('Error creating user:', error.message);
  }
};

createUser();
