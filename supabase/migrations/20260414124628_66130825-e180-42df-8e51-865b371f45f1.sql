
-- Add image_url column to project_submissions
ALTER TABLE public.project_submissions
ADD COLUMN image_url text;

-- Create storage bucket for project submission images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Allow anyone to view images
CREATE POLICY "Anyone can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Allow users to update their own uploads
CREATE POLICY "Users can update own project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);
