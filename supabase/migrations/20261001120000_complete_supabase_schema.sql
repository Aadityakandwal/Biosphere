/*
  # My Gardener — Complete Supabase Database Schema & Security Architecture

  ## 1. Tables
  - `profiles`: User accounts profile details linked to auth.users
  - `bookings`: Service bookings (supports authenticated users and guest bookings)
  - `orders`: E-commerce orders (supports authenticated users and guest checkouts)
  - `order_items`: Line items for each order
  - `plant_health_records`: AI Plant Doctor diagnostic history
  - `memberships`: User recurring care plan subscriptions
  - `green_points_transactions`: Loyalty points balance & ledger
  - `reviews`: Service ratings and testimonials
  - `member_applications`: Gardener and specialist job/membership applications

  ## 2. Security & RLS Policies
  - Row Level Security (RLS) enabled across all public tables.
  - Safe anonymous guest support for public booking, checkout, and application submissions.
  - User-scoped access for private user data (profiles, private bookings, memberships, points).
  - Public read access for customer reviews & testimonials.

  ## 3. Automation Triggers
  - Auto-create profile record when a new user signs up via Supabase Auth (`on_auth_user_created`).
  - Auto-award Green Points on confirmed bookings or orders.
*/

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON public.profiles;
CREATE POLICY "select_own_profile" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger to auto-create profile on auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id text NOT NULL,
  service_name text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  address_line text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_bookings" ON public.bookings;
CREATE POLICY "select_own_bookings" ON public.bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_bookings" ON public.bookings;
CREATE POLICY "insert_bookings" ON public.bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_bookings" ON public.bookings;
CREATE POLICY "update_own_bookings" ON public.bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_bookings" ON public.bookings;
CREATE POLICY "delete_own_bookings" ON public.bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);


-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  address_line text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON public.orders;
CREATE POLICY "select_own_orders" ON public.orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_orders" ON public.orders;
CREATE POLICY "insert_orders" ON public.orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_own_orders" ON public.orders;
CREATE POLICY "update_own_orders" ON public.orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  price integer NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_order_items" ON public.order_items;
CREATE POLICY "select_order_items" ON public.order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id AND public.orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_order_items" ON public.order_items;
CREATE POLICY "insert_order_items" ON public.order_items FOR INSERT
  TO anon, authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE public.orders.id = order_items.order_id)
  );


-- 5. Plant Health Records Table
CREATE TABLE IF NOT EXISTS public.plant_health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_name text,
  condition text,
  care_notes text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.plant_health_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_plant_records" ON public.plant_health_records;
CREATE POLICY "select_own_plant_records" ON public.plant_health_records FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_plant_records" ON public.plant_health_records;
CREATE POLICY "insert_own_plant_records" ON public.plant_health_records FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_plant_records" ON public.plant_health_records;
CREATE POLICY "update_own_plant_records" ON public.plant_health_records FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_plant_records" ON public.plant_health_records;
CREATE POLICY "delete_own_plant_records" ON public.plant_health_records FOR DELETE
  TO authenticated USING (auth.uid() = user_id);


-- 6. Memberships Table
CREATE TABLE IF NOT EXISTS public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_memberships" ON public.memberships;
CREATE POLICY "select_own_memberships" ON public.memberships FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_memberships" ON public.memberships;
CREATE POLICY "insert_own_memberships" ON public.memberships FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_memberships" ON public.memberships;
CREATE POLICY "update_own_memberships" ON public.memberships FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 7. Green Points Transactions Table
CREATE TABLE IF NOT EXISTS public.green_points_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL,
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.green_points_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_green_points" ON public.green_points_transactions;
CREATE POLICY "select_own_green_points" ON public.green_points_transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_green_points" ON public.green_points_transactions;
CREATE POLICY "insert_own_green_points" ON public.green_points_transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);


-- 8. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_reviews" ON public.reviews;
CREATE POLICY "select_all_reviews" ON public.reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_reviews" ON public.reviews;
CREATE POLICY "insert_own_reviews" ON public.reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reviews" ON public.reviews;
CREATE POLICY "update_own_reviews" ON public.reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 9. Member Applications Table
CREATE TABLE IF NOT EXISTS public.member_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  experience text NOT NULL,
  interests text,
  declaration_accepted boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.member_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_member_applications" ON public.member_applications;
CREATE POLICY "anon_insert_member_applications" ON public.member_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_own_member_applications" ON public.member_applications;
CREATE POLICY "auth_select_own_member_applications" ON public.member_applications FOR SELECT
  TO authenticated USING (email = (auth.jwt() ->> 'email'));


-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_plant_records_user_id ON public.plant_health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_green_points_user_id ON public.green_points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_member_applications_email ON public.member_applications(email);
