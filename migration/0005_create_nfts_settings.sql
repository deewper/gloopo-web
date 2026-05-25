-- Migration 0005: Create NFTs CMS configurations
-- Created At: 2026-05-26
-- Description: Adds a new setting key 'nfts' to store configurations for the NFTs section, including its maintenance/development status.

-- Insert default configurations for NFTs if not already present
INSERT INTO public.website_settings (key, value)
VALUES (
  'nfts',
  '{"maintenanceMode": true}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
