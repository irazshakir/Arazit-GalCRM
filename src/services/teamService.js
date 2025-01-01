import { supabase } from '../config/supabase';

const teamService = {
  async getTeams() {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_manager:users!teams_team_manager_fkey (
            id,
            name,
            email
          ),
          team_members!inner (
            id,
            user:users (
              id,
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to flatten the nested user information
      const transformedData = data.map(team => ({
        ...team,
        members: team.team_members.map(member => member.user)
      }));
      
      return transformedData;
    } catch (error) {
      throw error;
    }
  },

  async createTeam(teamData) {
    try {
      // First create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{
          name: teamData.name,
          description: teamData.description,
          team_manager: teamData.team_manager,
          is_active: true
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Then create team members entries if there are any members
      if (teamData.team_members && teamData.team_members.length > 0) {
        const teamMembers = teamData.team_members.map(userId => ({
          team_id: team.id,
          user_id: userId
        }));

        const { error: memberError } = await supabase
          .from('team_members')
          .insert(teamMembers);

        if (memberError) throw memberError;
      }

      return team;
    } catch (error) {
      throw error;
    }
  },

  async updateTeam(teamId, teamData) {
    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .update({
          name: teamData.name,
          description: teamData.description,
          team_manager: teamData.team_manager,
          is_active: teamData.is_active
        })
        .eq('id', teamId)
        .select()
        .single();

      if (teamError) throw teamError;

      // Update team members
      if (teamData.team_members) {
        // First delete existing team members
        const { error: deleteError } = await supabase
          .from('team_members')
          .delete()
          .eq('team_id', teamId);

        if (deleteError) throw deleteError;

        // Then create new team members entries
        if (teamData.team_members.length > 0) {
          const teamMembers = teamData.team_members.map(userId => ({
            team_id: teamId,
            user_id: userId
          }));

          const { error: memberError } = await supabase
            .from('team_members')
            .insert(teamMembers);

          if (memberError) throw memberError;
        }
      }

      return team;
    } catch (error) {
      throw error;
    }
  },

  async deleteTeam(teamId) {
    try {
      // With ON DELETE CASCADE, we don't need to manually delete team_members
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
};

export default teamService;
