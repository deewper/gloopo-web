-- Migration 0006: Create Partners Storage Bucket
-- Created At: 2026-05-26
-- Description: Creates a public storage bucket named 'partners'.
--              Files are publicly accessible via direct URL (no SELECT policy needed).
--              Only authenticated admins can upload/delete files.

-- Ensure the partners storage bucket exists on Supabase instances
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'buckets') THEN
    -- Insert public bucket (files accessible via direct URL without any RLS SELECT policy)
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('partners', 'partners', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']) -- 5MB limit
    ON CONFLICT (id) DO NOTHING;

    -- Drop any old/broad policies
    DROP POLICY IF EXISTS "Allow admin manage partners objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public read partners objects" ON storage.objects;
    DROP POLICY IF EXISTS "Allow admin select partners objects" ON storage.objects;

    -- INSERT: only authenticated admins can upload
    CREATE POLICY "Allow admin insert partners objects"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'partners' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- UPDATE: only authenticated admins can update
    CREATE POLICY "Allow admin update partners objects"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'partners' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
      WITH CHECK (
        bucket_id = 'partners' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- DELETE: only authenticated admins can delete
    CREATE POLICY "Allow admin delete partners objects"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'partners' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

    -- SELECT (list): only authenticated admins can list files in the dashboard.
    -- Public users access files via direct public URL — no broad SELECT needed.
    CREATE POLICY "Allow admin select partners objects"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'partners' AND
        EXISTS (
          SELECT 1 FROM public.admin_profiles
          WHERE id = auth.uid() AND role = 'admin'
        )
      );

  END IF;
END $$;
