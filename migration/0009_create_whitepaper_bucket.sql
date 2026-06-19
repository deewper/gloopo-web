-- Migration 0009: Create Whitepaper Storage Bucket
-- Created At: 2026-06-17
-- Description: Creates a public storage bucket named 'whitepaper' for PDF uploads.
--              Files are publicly accessible via direct URL.
--              Only authenticated admins can upload/delete files.

-- Ensure the whitepaper storage bucket exists on Supabase instances
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'buckets') THEN
    -- Insert public bucket (files accessible via direct URL without RLS SELECT policy)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('whitepaper', 'whitepaper', true, 52428800, ARRAY['application/pdf']) -- 50MB limit, PDF only
    ON CONFLICT (id) DO NOTHING;

    -- Drop any old policies if re-running
    DROP POLICY IF EXISTS "Allow admin insert whitepaper objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow admin update whitepaper objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow admin delete whitepaper objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow admin select whitepaper objects" ON storage.objects;

    -- INSERT: only authenticated admins can upload
    CREATE POLICY "Allow admin insert whitepaper objects"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'whitepaper' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- UPDATE: only authenticated admins can update
    CREATE POLICY "Allow admin update whitepaper objects"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'whitepaper' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
      WITH CHECK (
        bucket_id = 'whitepaper' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- DELETE: only authenticated admins can delete
    CREATE POLICY "Allow admin delete whitepaper objects"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'whitepaper' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- SELECT (list): only authenticated admins can list files in the dashboard
    CREATE POLICY "Allow admin select whitepaper objects"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'whitepaper' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

  END IF;
END $$;
