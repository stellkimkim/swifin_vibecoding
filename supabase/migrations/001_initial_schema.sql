-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    store_name TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    receipt_date DATE NOT NULL,
    receipt_time TIME,
    image_url TEXT,
    category TEXT DEFAULT 'etc' CHECK (category IN ('food', 'cafe', 'shopping', 'transport', 'culture', 'subscription', 'etc')),
    items JSONB DEFAULT '[]'::jsonb,
    memo TEXT,
    ocr_raw JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Receipts
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Receipts Policies
CREATE POLICY "Users can perform all actions on their own receipts" 
ON public.receipts FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Receipts Index for performance
CREATE INDEX IF NOT EXISTS receipts_user_id_idx ON public.receipts(user_id);
CREATE INDEX IF NOT EXISTS receipts_date_idx ON public.receipts(receipt_date);

-- 3. Swipes Table (Reflection Evaluations)
CREATE TABLE IF NOT EXISTS public.swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receipt_id UUID REFERENCES public.receipts(id) ON DELETE CASCADE NOT NULL UNIQUE,
    direction TEXT NOT NULL CHECK (direction IN ('worth', 'regret')),
    tag TEXT,
    swiped_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Swipes
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;

-- Swipes Policies
CREATE POLICY "Users can perform all actions on their own swipes" 
ON public.swipes FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Swipes Indexes
CREATE INDEX IF NOT EXISTS swipes_user_id_idx ON public.swipes(user_id);
CREATE INDEX IF NOT EXISTS swipes_receipt_id_idx ON public.swipes(receipt_id);

-- 4. Monthly Reports Table (AI analysis Cache)
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    year_month TEXT NOT NULL CHECK (year_month ~ '^\d{4}-\d{2}$'), -- Format: YYYY-MM
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    total_worth NUMERIC(12, 2) DEFAULT 0 CHECK (total_worth >= 0),
    total_regret NUMERIC(12, 2) DEFAULT 0 CHECK (total_regret >= 0),
    category_stats JSONB DEFAULT '{}'::jsonb,
    persona TEXT,
    persona_description TEXT,
    ai_insights JSONB DEFAULT '[]'::jsonb,
    ai_suggestions JSONB DEFAULT '[]'::jsonb,
    ai_coach_message TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, year_month)
);

-- Enable RLS for Monthly Reports
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;

-- Monthly Reports Policies
CREATE POLICY "Users can view their own monthly reports" 
ON public.monthly_reports FOR SELECT 
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS reports_user_month_idx ON public.monthly_reports(user_id, year_month);

-- 5. Trigger to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, onboarding_completed)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
