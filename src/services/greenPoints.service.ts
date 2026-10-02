import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables } from '@/lib/supabase';

export type GreenPointsTransaction = Tables<'green_points_transactions'>;
export type GreenPointsInsert = InsertTables<'green_points_transactions'>;

export const greenPointsService = {
  async getTransactions(userId: string): Promise<GreenPointsTransaction[]> {
    const { data, error } = await supabase
      .from('green_points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBalance(userId: string): Promise<number> {
    const transactions = await this.getTransactions(userId);
    return transactions.reduce((sum, t) => sum + (t.points || 0), 0);
  },

  async addTransaction(payload: GreenPointsInsert): Promise<GreenPointsTransaction> {
    const { data, error } = await supabase
      .from('green_points_transactions')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
