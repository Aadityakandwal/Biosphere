import { supabase } from '@/lib/supabase';
import type { Tables, UpdateTables } from '@/lib/supabase';

export type Profile = Tables<'profiles'>;
export type ProfileUpdate = UpdateTables<'profiles'>;

export const profilesService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Omit<ProfileUpdate, 'id'>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
