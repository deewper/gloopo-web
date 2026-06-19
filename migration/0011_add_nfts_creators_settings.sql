-- Migration 0011: Add collection-specific creator addresses and set Gloopo OG Pass parameters
-- Created At: 2026-06-18
-- Description: Updates the 'nfts' setting JSON configuration with separate creator addresses for each tab and seeds the live OG Pass collection configuration.

UPDATE public.website_settings
SET
  value = value || '{
    "ogpassCreator": "0x95152607dd23fada5ba1c5b3cf323df762d352278db363604b492982f9524762",
    "ogpassCollection": "GLOOPO OG",
    "ogpassMaintenance": false,
    "gen01Creator": "0xdd88dba0c8e21dc8e08685d81e0853f4dd3e711f8b70b66fc29be6fbfc6ce0bb",
    "gen01Collection": "Gloopo",
    "gen01Maintenance": false,
    "gen02Creator": "",
    "gen02Collection": "",
    "gen02Maintenance": true,
    "gen03Creator": "",
    "gen03Collection": "",
    "gen03Maintenance": true
  }'::jsonb,
  updated_at = NOW()
WHERE key = 'nfts';

-- Verify update
SELECT key, value FROM public.website_settings WHERE key = 'nfts';
