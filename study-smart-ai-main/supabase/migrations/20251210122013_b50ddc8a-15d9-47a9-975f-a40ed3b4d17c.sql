-- Create subjects table for storing user's study subjects with deadlines
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public access for now - no auth required)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access (for MVP without auth)
CREATE POLICY "Allow public read access" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.subjects FOR DELETE USING (true);
CREATE POLICY "Allow public update access" ON public.subjects FOR UPDATE USING (true);