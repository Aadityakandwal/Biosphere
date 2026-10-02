import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables } from '@/lib/supabase';

export type Membership = Tables<'memberships'>;
export type MembershipInsert = InsertTables<'memberships'>;

export const membershipsService = {
  async getActiveMembership(userId: string): Promise<Membership | null> {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createMembership(userId: string, planId: string): Promise<Membership> {
    const { data, error } = await supabase
      .from('memberships')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async cancelMembership(membershipId: string): Promise<Membership> {
    const { data, error } = await supabase
      .from('memberships')
      .update({ status: 'cancelled' })
      .eq('id', membershipId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
