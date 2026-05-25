-- Migration 0003: Create Website Settings persistence table for CMS sections
-- Created At: 2026-05-17
-- Description: Creates a key-value store powered by JSONB to persist landing page content (About, Tokenomics, Social Links, Brand Kit, Roadmap).

-- Create website settings key-value table
CREATE TABLE IF NOT EXISTS public.website_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies if re-running
DROP POLICY IF EXISTS "Allow public read website settings" ON public.website_settings;
DROP POLICY IF EXISTS "Allow authenticated administrators write website settings" ON public.website_settings;

-- Create policy to allow public select (reading) of website configurations
CREATE POLICY "Allow public read website settings" 
  ON public.website_settings 
  FOR SELECT 
  USING (true);

-- Create policy to allow logged-in administrators to insert, update, or delete settings rows
CREATE POLICY "Allow authenticated administrators write website settings" 
  ON public.website_settings 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Bind automatic updated_at trigger
DROP TRIGGER IF EXISTS set_website_settings_updated_at ON public.website_settings;
CREATE TRIGGER set_website_settings_updated_at
  BEFORE UPDATE ON public.website_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default starter configurations for CMS (so the database is pre-populated on run)
INSERT INTO public.website_settings (key, value)
VALUES
  ('general', '{
    "siteName": "Gloopo",
    "siteTitle": "Gloopo - Community-Driven Assets on Supra L1",
    "metaDescription": "Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration.",
    "maintenanceMode": false
  }'::jsonb),
  
  ('about', '{
    "headline": "Who is Gloopo?",
    "subheadline": "Origin Story",
    "description": "Born natively on the Supra L1 blockchain, Gloopo is a unique entity that represents the evolution of digital exploration. More than just an asset, Gloopo is a narrative journey that transforms holders into explorers of the Supra ecosystem."
  }'::jsonb),
  
  ('tokenomics', '{
    "ticker": "GLOOPO",
    "totalSupply": "1,000,000,000",
    "liquidityFee": "2.0%",
    "marketingFee": "1.0%",
    "chartData": [
      {"label": "Public Pool", "percentage": 20, "color": "#00FF88"},
      {"label": "LLIM Treasury", "percentage": 20, "color": "#10F090"},
      {"label": "Ecosystem", "percentage": 20, "color": "#20E198"},
      {"label": "Core Team", "percentage": 10, "color": "#30D2A0"},
      {"label": "Airdrop", "percentage": 10, "color": "#40C3A8"},
      {"label": "NFT Holders", "percentage": 10, "color": "#50B4B0"},
      {"label": "Treasury", "percentage": 5, "color": "#60A5B8"},
      {"label": "Strategic", "percentage": 5, "color": "#7096C0"}
    ]
  }'::jsonb),
  
  ('socials', '{
    "twitter": "https://x.com/gloopo",
    "telegram": "https://t.me/gloopo",
    "discord": "https://discord.gg/gloopo",
    "medium": "https://medium.com/@gloopo"
  }'::jsonb),
  
  ('brandkit', '{
    "primaryColor": "#00ff88",
    "accentColor": "#bbff00",
    "backgroundColor": "#030806",
    "logoPngUrl": "/images/gloo-text.png",
    "logoSvgPath": "M12 2L2 22h20L12 2z",
    "assetsList": [
      {
        "title": "Gloopo 3D Mascot Character",
        "filename": "gloo_character.png",
        "path": "/images/gloo_character.png",
        "size": "737 KB",
        "dimensions": "2048 x 2048 px",
        "format": "High-Res PNG",
        "desc": "Official mascot icon for banners, listings, and profile graphics."
      },
      {
        "title": "Gloopo Wordmark Typography",
        "filename": "gloo-text.png",
        "path": "/images/gloo-text.png",
        "size": "39.6 KB",
        "dimensions": "800 x 300 px",
        "format": "Transparent PNG",
        "desc": "Logotype for banners, website headers, and corporate listings."
      },
      {
        "title": "Tokenomics Pie Render",
        "filename": "token-char.png",
        "path": "/images/token-char.png",
        "size": "539 KB",
        "dimensions": "1024 x 1024 px",
        "format": "Isolated PNG",
        "desc": "Official 3D illustrated pie chart asset for pitch decks and slides."
      },
      {
        "title": "Space Exploration Landscape",
        "filename": "brand-kit.png",
        "path": "/images/brand-kit.png",
        "size": "685 KB",
        "dimensions": "1920 x 1080 px",
        "format": "Wallpapers PNG",
        "desc": "Premium futuristic space vector scenery used in section backgrounds."
      },
      {
        "title": "Gloopo Mascot Animation",
        "filename": "gloopo.gif",
        "path": "/images/gloopo.gif",
        "size": "15.4 MB",
        "dimensions": "600 x 600 px",
        "format": "Vector GIF",
        "desc": "Motion design mascot animation for presentation overlays."
      },
      {
        "title": "Hero Backdrop Nebula",
        "filename": "hero_bg.png",
        "path": "/images/hero_bg.png",
        "size": "753 KB",
        "dimensions": "1920 x 1080 px",
        "format": "Futuristic JPG",
        "desc": "Dark galactic atmospheric background graphic for landing pages."
      }
    ]
  }'::jsonb),
  
  ('roadmap', '[
    {"phase": "Phase 0", "title": "Preparation", "status": "completed", "items": ["Token Studio creation", "75% pre-buy execution", "Crystara NFT collection"]},
    {"phase": "Phase 1", "title": "Activation", "status": "completed", "items": ["G/$S pool deployment", "LLIM Activation", "Liquidity top-ups"]},
    {"phase": "Phase 2", "title": "Dominance", "status": "active", "items": ["Gen 1 NFT Launch", "Social dominance campaign", "Community expansion"]},
    {"phase": "Phase 3", "title": "Governance", "status": "pending", "items": ["Lore expansion", "Website integration", "Gloopo DAO Launch"]},
    {"phase": "Phase 4", "title": "Expansion", "status": "pending", "items": ["Final LLIM Deployment", "Cross-chain reach", "Supra Bridging"]}
  ]'::jsonb),
  
  ('buttons', '{
    "showConnectButton": true,
    "showLore": true,
    "showTech": true,
    "showTokenomics": true,
    "showSwap": true,
    "showRoadmap": true,
    "showShowcase": true,
    "showBrandKit": true
  }'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Ensure the brand-kit storage bucket exists on Supabase instances
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'buckets') THEN
    -- Insert bucket
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('brand-kit', 'brand-kit', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'])
    ON CONFLICT (id) DO NOTHING;

    -- Drop existing storage policies if any to prevent collision and broad client access
    DROP POLICY IF EXISTS "Allow public read brand-kit objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated read brand-kit objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated write brand-kit objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow admin manage brand-kit objects" ON storage.objects;

    -- Create single secure all-access policy ONLY for administrators
    CREATE POLICY "Allow admin manage brand-kit objects"
      ON storage.objects FOR ALL
      TO authenticated
      USING (
        bucket_id = 'brand-kit' AND 
        EXISTS (
          SELECT 1 FROM public.admin_profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
      WITH CHECK (
        bucket_id = 'brand-kit' AND 
        EXISTS (
          SELECT 1 FROM public.admin_profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;
