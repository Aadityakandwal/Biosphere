import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables } from '@/lib/supabase';

export type MemberApplication = Tables<'member_applications'>;
export type MemberApplicationInsert = InsertTables<'member_applications'>;

export const memberApplicationsService = {
  async submitApplication(application: MemberApplicationInsert): Promise<MemberApplication> {
    const { data, error } = await supabase
      .from('member_applications')
      .insert(application)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApplicationsByEmail(email: string): Promise<MemberApplication[]> {
    const { data, error } = await supabase
      .from('member_applications')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
