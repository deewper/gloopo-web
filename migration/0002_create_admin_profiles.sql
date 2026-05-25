-- Migration 0002: Create Admin Profiles table and automated triggers
-- Created At: 2026-05-17
-- Description: Sets up the public.admin_profiles table which automatically maps and syncs with Supabase Auth (auth.users).

-- Create the admin profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(150) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'admin' NOT NULL,
  status VARCHAR(50) DEFAULT 'active' NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS "Allow authenticated users to read admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow administrators to update their own profile" ON public.admin_profiles;

-- Create policy: Any authenticated user can read admin profiles
CREATE POLICY "Allow authenticated users to read admin profiles" 
  ON public.admin_profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy: Logged-in admin can only update their own profile record
CREATE POLICY "Allow administrators to update their own profile" 
  ON public.admin_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

-- Create trigger function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind trigger to table
DROP TRIGGER IF EXISTS set_admin_profile_updated_at ON public.admin_profiles;
CREATE TRIGGER set_admin_profile_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger function to automatically create a profile record when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, email, username, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    'admin'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind automatic profile sync trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_signup();
