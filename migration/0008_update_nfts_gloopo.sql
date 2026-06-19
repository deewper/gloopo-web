-- Migration 0008: Update NFT Showcase settings to Gloopo Collection
-- Created At: 2026-06-17
-- Description: Updates the 'nfts' setting in website_settings to point to the
--              official Gloopo Gen-1 collection on Crystara mainnet.
--              Collection name is case-sensitive: must be "Gloopo" (not "GLOOPO" or "gloopo").

UPDATE public.website_settings
SET
  value = '{
    "maintenanceMode": false,
    "crystaraCreator": "0xdd88dba0c8e21dc8e08685d81e0853f4dd3e711f8b70b66fc29be6fbfc6ce0bb",
    "crystaraCollection": "Gloopo",
    "crystaraApiKey": "73a7210e4bef4ddeb5c75f19cfe754359f99a596899041f6b78f8a8b28e03a24",
    "crystaraNetwork": "mainnet"
  }'::jsonb,
  updated_at = NOW()
WHERE key = 'nfts';

-- Verify update
SELECT key, value FROM public.website_settings WHERE key = 'nfts';
