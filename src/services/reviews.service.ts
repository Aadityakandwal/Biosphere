import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables } from '@/lib/supabase';

export type Review = Tables<'reviews'>;
export type ReviewInsert = InsertTables<'reviews'>;

export const reviewsService = {
  async createReview(payload: ReviewInsert): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getReviews(limit = 10): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getReviewsByBooking(bookingId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', bookingId);

    if (error) throw error;
    return data || [];
  },
};
