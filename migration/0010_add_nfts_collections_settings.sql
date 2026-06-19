-- Migration 0010: Add collection names and maintenance settings for OG Pass, Gen 01, Gen 02, and Gen 03
-- Created At: 2026-06-17
-- Description: Updates the 'nfts' setting JSON configuration with separate collection names and maintenance modes for all 4 tabs.

UPDATE public.website_settings
SET
  value = value || '{
    "ogpassCollection": "Gloopo OG Pass",
    "ogpassMaintenance": true,
    "gen01Collection": "Gloopo",
    "gen01Maintenance": false,
    "gen02Collection": "",
    "gen02Maintenance": true,
    "gen03Collection": "",
    "gen03Maintenance": true
  }'::jsonb,
  updated_at = NOW()
WHERE key = 'nfts';

-- Verify update
SELECT key, value FROM public.website_settings WHERE key = 'nfts';
