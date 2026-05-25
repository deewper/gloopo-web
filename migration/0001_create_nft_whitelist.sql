-- Migration 0001: Create NFT Whitelist persistence table
-- Created At: 2026-05-17
-- Description: Creates the nft_whitelist table and sets up public read, admin write Row Level Security (RLS) policies.

-- Create NFT Whitelist table if it does not already exist
CREATE TABLE IF NOT EXISTS public.nft_whitelist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  tier VARCHAR(100) DEFAULT 'Alpha Tester',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.nft_whitelist ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running migration
DROP POLICY IF EXISTS "Allow public read whitelist" ON public.nft_whitelist;
DROP POLICY IF EXISTS "Admin write access" ON public.nft_whitelist;

-- Create policy to allow public select (reading) of the whitelist
CREATE POLICY "Allow public read whitelist" 
  ON public.nft_whitelist 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated administrators (logged-in Supabase users) full access (ALL: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admin write access" 
  ON public.nft_whitelist 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
