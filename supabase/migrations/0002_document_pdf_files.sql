ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_path text;
-- TEMPORARY demo mode: open access to the documents bucket (remove with sign-in)
CREATE POLICY "demo read document files" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'documents');
CREATE POLICY "demo upload document files" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "demo update document files" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'documents');
CREATE POLICY "demo delete document files" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'documents');