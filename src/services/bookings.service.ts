import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables, UpdateTables } from '@/lib/supabase';

export type Booking = Tables<'bookings'>;
export type BookingInsert = InsertTables<'bookings'>;
export type BookingUpdate = UpdateTables<'bookings'>;

export const bookingsService = {
  async createBooking(bookingData: BookingInsert): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBookingById(id: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async checkFreeCheckEligibility(phone: string, email: string): Promise<boolean> {
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('service_id', 'free-garden-check')
      .or(`customer_phone.eq.${trimmedPhone},customer_email.eq.${trimmedEmail}`)
      .limit(1);

    if (error) throw error;
    return !data || data.length === 0;
  },

  async updateBookingStatus(
    id: string,
    status: Booking['status']
  ): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
