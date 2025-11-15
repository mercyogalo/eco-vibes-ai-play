-- Environmental Alerts table for radar tracking
CREATE TABLE public.environmental_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'regulation', 'incident', 'deforestation', 'pollution', 'land_grabbing'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  source TEXT, -- NEMA, NLC, Ministry, NGO, etc.
  location TEXT,
  responsible_party TEXT,
  action_needed TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  alert_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Eco Reports table for crowdsourced evidence
CREATE TABLE public.eco_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'land_grabbing', 'pollution', 'illegal_logging', 'government_irregularity'
  location TEXT NOT NULL,
  image_urls TEXT[], -- Array of image URLs
  video_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Report Verifications (upvotes)
CREATE TABLE public.report_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.eco_reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  verified BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_id, user_id)
);

-- Petitions table
CREATE TABLE public.petitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal INTEGER NOT NULL,
  signatures_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Petition Signatures
CREATE TABLE public.petition_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  petition_id UUID REFERENCES public.petitions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(petition_id, user_id)
);

-- Video Content table
CREATE TABLE public.video_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  platform TEXT, -- 'tiktok', 'instagram', 'youtube'
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.environmental_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petition_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for environmental_alerts
CREATE POLICY "Anyone can view alerts" ON public.environmental_alerts
  FOR SELECT USING (true);

-- RLS Policies for eco_reports
CREATE POLICY "Anyone can view reports" ON public.eco_reports
  FOR SELECT USING (true);

CREATE POLICY "Users can create reports" ON public.eco_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.eco_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for report_verifications
CREATE POLICY "Anyone can view verifications" ON public.report_verifications
  FOR SELECT USING (true);

CREATE POLICY "Users can verify reports" ON public.report_verifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for petitions
CREATE POLICY "Anyone can view petitions" ON public.petitions
  FOR SELECT USING (true);

-- RLS Policies for petition_signatures
CREATE POLICY "Anyone can view signatures" ON public.petition_signatures
  FOR SELECT USING (true);

CREATE POLICY "Users can sign petitions" ON public.petition_signatures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for video_content
CREATE POLICY "Anyone can view videos" ON public.video_content
  FOR SELECT USING (true);

CREATE POLICY "Users can create videos" ON public.video_content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON public.video_content
  FOR UPDATE USING (auth.uid() = user_id);