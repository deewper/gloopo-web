-- Migration 0004: Setup and Ensure Global Maintenance Mode
-- Created At: 2026-05-26
-- Description: Ensures the 'general' key exists in website_settings with maintenanceMode support.

-- Insert default general configuration if not already present
INSERT INTO public.website_settings (key, value)
VALUES (
  'general',
  '{"siteName": "Gloopo", "siteTitle": "Gloopo - Community-Driven Assets on Supra L1", "metaDescription": "Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration.", "maintenanceMode": false}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
