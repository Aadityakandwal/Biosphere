import { supabase } from '@/lib/supabase';
import type { Tables, InsertTables } from '@/lib/supabase';

export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type OrderInsert = InsertTables<'orders'>;
export type OrderItemInsert = InsertTables<'order_items'>;

export interface CartOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line: string;
  city: string;
  pincode: string;
  total: number;
  user_id?: string | null;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export const ordersService = {
  async createOrderWithItems(payload: CartOrderPayload): Promise<{ order: Order; items: OrderItem[] }> {
    const { items, ...orderData } = payload;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        address_line: orderData.address_line,
        city: orderData.city,
        pincode: orderData.pincode,
        total: orderData.total,
        user_id: orderData.user_id || null,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItemsToInsert: OrderItemInsert[] = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { data: insertedItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)
      .select();

    if (itemsError) throw itemsError;

    return { order, items: insertedItems || [] };
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getOrderById(orderId: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderError) throw orderError;
    if (!order) return null;

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    return { order, items: items || [] };
  },

  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    razorpayPaymentId?: string,
    razorpayOrderId?: string
  ): Promise<Order> {
    const updates: Partial<Order> = { status };
    if (razorpayPaymentId) updates.razorpay_payment_id = razorpayPaymentId;
    if (razorpayOrderId) updates.razorpay_order_id = razorpayOrderId;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
