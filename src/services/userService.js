import { supabase } from '../config/supabase';

const userService = {
  // Get all users
  async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*, roles:role_id(role_name), branches:branch_id(branch_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a new user
  async createUser(userData) {
    try {
      // First create the auth user
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (authError) throw authError;

      // Then create the user record in our users table
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .insert([{
          id: authUser.user.id, // Use the auth user's ID
          email: userData.email,
          name: userData.name,
          role_id: userData.role_id,
          branch_id: userData.branch_id,
          user_is_active: userData.user_is_active,
          email_verified: false,
          image: userData.imageUrl, // Store image URL
          created_at: new Date().toISOString()
        }])
        .select('*, roles:role_id(role_name), branches:branch_id(branch_name)')
        .single();

      if (dbError) {
        // If database insert fails, delete the auth user
        await supabase.auth.admin.deleteUser(authUser.user.id);
        throw dbError;
      }

      return dbUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update a user
  async updateUser(id, updates) {
    try {
      // Update user data in the database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .update({
          name: updates.name,
          role_id: updates.role_id,
          branch_id: updates.branch_id,
          user_is_active: updates.user_is_active,
          image: updates.imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, roles:role_id(role_name), branches:branch_id(branch_name)')
        .single();

      if (dbError) throw dbError;

      // If there's a new password, update it through a separate API endpoint
      if (updates.password) {
        // You should implement a separate backend endpoint to handle password updates
        console.warn('Password updates should be handled through a separate secure endpoint');
      }

      return dbUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete a user (both from Auth and DB)
  async deleteUser(id) {
    try {
      // First delete from Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // Then delete from the database
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .match({ id });

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Reactivate a user
  async reactivateUser(id) {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        user_is_active: true,
        inactivated_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, roles:role_id(role_name), branches:branch_id(branch_name)')
      .single();

    if (error) throw error;
    return data;
  },

  // Activate a user
  async activateUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ user_is_active: true })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Deactivate a user
  async deactivateUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ user_is_active: false })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  // Update password with reset token
  async updatePasswordWithToken(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },

  // Send email verification link
  async resendVerificationEmail(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  },

  // Update email verification status in database
  async updateEmailVerificationStatus(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating email verification status:', error);
      throw error;
    }
  },

  // Check if email is verified
  async checkEmailVerification(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email_verified, email_verified_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking email verification:', error);
      throw error;
    }
  },

  // Get inactive users
  async getInactiveUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          created_at,
          roles (
            id,
            role_name
          )
        `)
        .eq('user_is_active', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get invites
  async getInvites() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          created_at,
          roles (
            id,
            role_name
          )
        `)
        .eq('email_verified', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel invite
  async cancelInvite(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
        .eq('email_verified', false);

      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;
