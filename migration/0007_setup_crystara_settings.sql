-- Migration 0007: Setup Crystara Settings defaults in website_settings
-- Created At: 2026-06-04
-- Description: Updates the 'nfts' setting JSON configuration with Crystara default fields (creator, collection, apiKey, network) if not already present.

-- Update nfts settings JSON dynamically using jsonb_concat or jsonb_set to preserve any existing maintenanceMode
UPDATE public.website_settings
SET value = value || '{"crystaraCreator": "", "crystaraCollection": "", "crystaraApiKey": "", "crystaraNetwork": "mainnet"}'::jsonb
WHERE key = 'nfts';

-- If for some reason the row doesn't exist, insert the full default
INSERT INTO public.website_settings (key, value)
VALUES (
  'nfts',
  '{"maintenanceMode": true, "crystaraCreator": "", "crystaraCollection": "", "crystaraApiKey": "", "crystaraNetwork": "mainnet"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
