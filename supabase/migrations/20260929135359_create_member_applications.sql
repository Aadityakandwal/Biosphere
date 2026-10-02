/*
# Create member_applications table

1. Purpose
   Stores applications from people who want to become part of My Gardener
   (as members or gardening professionals). Submitted from the "Become a Member"
   form on the Membership page.

2. New Table: member_applications
   - id (uuid, primary key)
   - full_name (text, not null) — applicant's full name
   - email (text, not null) — contact email
   - phone (text, not null) — contact phone number
   - city (text, not null) — city of residence
   - experience (text, not null) — free-text description of gardening experience
   - interests (text, nullable) — optional: what they're interested in
   - declaration_accepted (boolean, not null, default false) — tick box confirming the applicant accepts that whatever they stated is to their knowledge
   - status (text, not null, default 'pending') — application status
   - created_at (timestamptz, default now())

3. Security
   - Enable RLS on member_applications.
   - Allow anon + authenticated to INSERT (anyone can apply).
   - Allow authenticated to SELECT only their own applications (by email match via auth.jwt).
   - No UPDATE or DELETE from the frontend.
*/

CREATE TABLE IF NOT EXISTS member_applications (
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

ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_member_applications" ON member_applications;
CREATE POLICY "anon_insert_member_applications"
ON member_applications FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_own_member_applications" ON member_applications;
CREATE POLICY "auth_select_own_member_applications"
ON member_applications FOR SELECT
TO authenticated USING (email = (auth.jwt() ->> 'email'));
