import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '@/lib/supabase';

export type PlantHealthRecord = Tables<'plant_health_records'>;
export type PlantHealthRecordInsert = InsertTables<'plant_health_records'>;
export type PlantHealthRecordUpdate = UpdateTables<'plant_health_records'>;

export const plantHealthService = {
  async saveRecord(record: PlantHealthRecordInsert): Promise<PlantHealthRecord> {
    const { data, error } = await supabase
      .from('plant_health_records')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRecords(userId: string): Promise<PlantHealthRecord[]> {
    const { data, error } = await supabase
      .from('plant_health_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteRecord(recordId: string): Promise<void> {
    const { error } = await supabase
      .from('plant_health_records')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  },
};
