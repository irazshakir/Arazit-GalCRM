import { supabase } from '../config/supabase';

const handleError = (error) => {
  console.error('Supabase error:', error);
  if (error.code === 'PGRST301' || error.code === '42501') {
    throw new Error('You do not have permission to perform this action. Please ensure you have the correct role.');
  }
  if (error.code === 'PGRST204') {
    throw new Error('Authentication error: Please ensure you are logged in');
  }
  throw new Error(error.message || 'An error occurred while processing your request');
};

const checkAuth = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Authentication error: Please ensure you are logged in');
  }
  return user;
};

export const roleService = {
  // Get all roles
  async getRoles() {
    await checkAuth();
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) handleError(error);
    return data.map(role => ({
      ...role,
      role_is_active: Boolean(role.role_is_active)
    }));
  },

  // Create a new role
  async createRole(roleData) {
    await checkAuth();

    const { data, error } = await supabase
      .from('roles')
      .insert([{
        role_name: roleData.role_name,
        role_is_active: Boolean(roleData.role_is_active),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) handleError(error);
    return data?.[0] ? {
      ...data[0],
      role_is_active: Boolean(data[0].role_is_active)
    } : null;
  },

  // Update a role
  async updateRole(id, updates) {
    await checkAuth();

    const { data, error } = await supabase
      .from('roles')
      .update({
        role_name: updates.role_name,
        role_is_active: Boolean(updates.role_is_active),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) handleError(error);
    return data?.[0] ? {
      ...data[0],
      role_is_active: Boolean(data[0].role_is_active)
    } : null;
  },

  // Delete a role (soft delete)
  async deleteRole(id) {
    await checkAuth();

    const { data, error } = await supabase
      .from('roles')
      .update({ 
        role_is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) handleError(error);
    return data?.[0] ? {
      ...data[0],
      role_is_active: false
    } : null;
  }
};

export default roleService;
