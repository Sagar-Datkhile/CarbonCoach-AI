-- ==============================================================================
-- CarbonCoach AI - PostgreSQL Database Schema & Security Migrations
-- Migration: 00001_initial_schema.sql
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Extends Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on email
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ------------------------------------------------------------------------------
-- 2. Household Profiles Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.household_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_name TEXT NOT NULL DEFAULT 'My Household',
    home_type TEXT NOT NULL DEFAULT 'Owned' CHECK (home_type IN ('Owned', 'Rented', 'Shared', 'Other')),
    occupants_count INTEGER NOT NULL DEFAULT 2 CHECK (occupants_count > 0),
    region TEXT DEFAULT 'Global',
    budget_tier TEXT NOT NULL DEFAULT 'Moderate' CHECK (budget_tier IN ('Zero-Cost', 'Low', 'Moderate', 'High')),
    heating_type TEXT DEFAULT 'Electric',
    cooling_type TEXT DEFAULT 'Air Conditioning',
    preferred_currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_household_profiles_user_id ON public.household_profiles(user_id);

-- ------------------------------------------------------------------------------
-- 3. Emission Factors Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code TEXT NOT NULL UNIQUE,
    region_name TEXT NOT NULL,
    factor_kg_co2e_per_kwh NUMERIC(8, 4) NOT NULL CHECK (factor_kg_co2e_per_kwh > 0),
    currency_code TEXT NOT NULL DEFAULT 'USD',
    default_tariff_per_kwh NUMERIC(8, 4) NOT NULL DEFAULT 0.16 CHECK (default_tariff_per_kwh >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. Electricity Bills Table (Authoritative confirmed records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.electricity_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    consumer_number TEXT,
    bill_number TEXT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    billing_days INTEGER GENERATED ALWAYS AS ((billing_period_end - billing_period_start) + 1) STORED,
    energy_consumed_kwh NUMERIC(10, 2) NOT NULL CHECK (energy_consumed_kwh >= 0),
    bill_amount NUMERIC(10, 2) NOT NULL CHECK (bill_amount >= 0),
    tariff_rate NUMERIC(8, 4),
    currency TEXT NOT NULL DEFAULT 'USD',
    due_date DATE,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('draft', 'confirmed', 'archived')),
    estimated_emissions_kg NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (billing_period_end >= billing_period_start)
);

CREATE INDEX IF NOT EXISTS idx_bills_user_date ON public.electricity_bills(user_id, billing_period_start DESC);

-- ------------------------------------------------------------------------------
-- 5. Bill Extraction Logs Table (Audit of raw AI extraction attempts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bill_extraction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    raw_ai_response JSONB,
    validated_payload JSONB,
    status TEXT NOT NULL CHECK (status IN ('processing', 'success', 'failed', 'corrected')),
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_extraction_logs_user ON public.bill_extraction_logs(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. Recommendation Templates Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendation_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'electricity' CHECK (category IN ('electricity', 'heating', 'appliances', 'habits')),
    applicable_home_types TEXT[] NOT NULL DEFAULT '{"Owned", "Rented", "Shared"}',
    applicable_budget_tiers TEXT[] NOT NULL DEFAULT '{"Zero-Cost", "Low", "Moderate", "High"}',
    difficulty TEXT NOT NULL DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Moderate', 'Advanced')),
    estimated_kwh_reduction_annual NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_percent_reduction NUMERIC(5, 2) NOT NULL DEFAULT 0,
    upfront_cost_estimate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. User Actions Table (My Plan & Progress)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.recommendation_templates(id) ON DELETE SET NULL,
    custom_title TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'dismissed')),
    estimated_kwh_saving NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_cost_saving NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_co2_saving NUMERIC(10, 2) NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_actions_user_status ON public.user_actions(user_id, status);

-- ------------------------------------------------------------------------------
-- 8. Simulation Runs Table (What-If audit history)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    simulation_type TEXT NOT NULL DEFAULT 'lighting_replacement',
    input_parameters JSONB NOT NULL,
    calculated_kwh_saving NUMERIC(10, 2) NOT NULL,
    calculated_cost_saving NUMERIC(10, 2) NOT NULL,
    calculated_co2_saving NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simulations_user ON public.simulation_runs(user_id, created_at DESC);

-- ==============================================================================
-- Security Functions & Automatic Triggers
-- ==============================================================================

-- Security definer check for admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile and household profile when auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
        'user'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.household_profiles (user_id, household_name, home_type, occupants_count)
    VALUES (NEW.id, 'My Household', 'Owned', 2)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_household_profiles_updated_at BEFORE UPDATE ON public.household_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_electricity_bills_updated_at BEFORE UPDATE ON public.electricity_bills FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_user_actions_updated_at BEFORE UPDATE ON public.user_actions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.electricity_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_extraction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_runs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles RLS
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Household Profiles RLS
CREATE POLICY "Users can view own household" ON public.household_profiles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own household" ON public.household_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own household" ON public.household_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 3. Emission Factors RLS (Public read for authenticated users, Admin mutate)
CREATE POLICY "Anyone can view active emission factors" ON public.emission_factors FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins can insert emission factors" ON public.emission_factors FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update emission factors" ON public.emission_factors FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete emission factors" ON public.emission_factors FOR DELETE USING (public.is_admin());

-- 4. Electricity Bills RLS
CREATE POLICY "Users can view own bills" ON public.electricity_bills FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own bills" ON public.electricity_bills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bills" ON public.electricity_bills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bills" ON public.electricity_bills FOR DELETE USING (auth.uid() = user_id);

-- 5. Bill Extraction Logs RLS
CREATE POLICY "Users can view own extraction logs" ON public.bill_extraction_logs FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own extraction logs" ON public.bill_extraction_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Recommendation Templates RLS (All authenticated read, Admin mutate)
CREATE POLICY "Anyone can view active templates" ON public.recommendation_templates FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admins can insert templates" ON public.recommendation_templates FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update templates" ON public.recommendation_templates FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete templates" ON public.recommendation_templates FOR DELETE USING (public.is_admin());

-- 7. User Actions RLS
CREATE POLICY "Users can view own actions" ON public.user_actions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own actions" ON public.user_actions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own actions" ON public.user_actions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own actions" ON public.user_actions FOR DELETE USING (auth.uid() = user_id);

-- 8. Simulation Runs RLS
CREATE POLICY "Users can view own simulations" ON public.simulation_runs FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own simulations" ON public.simulation_runs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- Baseline Seed Data
-- ==============================================================================

-- Default Emission Factors (US National, India National, EU Average)
INSERT INTO public.emission_factors (region_code, region_name, factor_kg_co2e_per_kwh, currency_code, default_tariff_per_kwh, is_active)
VALUES
    ('US_AVG', 'United States (National Average)', 0.3860, 'USD', 0.1650, TRUE),
    ('IN_AVG', 'India (National Grid Average)', 0.7100, 'INR', 7.5000, TRUE),
    ('EU_AVG', 'European Union (Average)', 0.2300, 'EUR', 0.2800, TRUE),
    ('GLOBAL', 'Global Baseline Default', 0.4500, 'USD', 0.1500, TRUE)
ON CONFLICT (region_code) DO NOTHING;

-- Baseline Recommendation Templates (Deterministic, realistic household energy efficiency)
INSERT INTO public.recommendation_templates 
    (title, description, category, applicable_home_types, applicable_budget_tiers, difficulty, estimated_kwh_reduction_annual, estimated_percent_reduction, upfront_cost_estimate, is_active)
VALUES
    (
        'Switch High-Use Fixtures to High-Efficiency LEDs',
        'Replace five standard incandescent or halogen bulbs (60W) used for ~4 hours daily with energy-saving 9W LEDs.',
        'electricity',
        '{"Owned", "Rented", "Shared"}',
        '{"Low", "Moderate"}',
        'Easy',
        372.30,
        5.50,
        25.00,
        TRUE
    ),
    (
        'Eliminate Phantom Power with Smart Power Strips',
        'Plug television consoles, audio equipment, and home office workstations into smart power strips that cut standby vampire load automatically.',
        'appliances',
        '{"Owned", "Rented", "Shared"}',
        '{"Zero-Cost", "Low"}',
        'Easy',
        180.00,
        2.80,
        30.00,
        TRUE
    ),
    (
        'Adjust Thermostat Setpoint by 1°C / 2°F',
        'Adjust cooling setpoint up 1°C in warm months and heating down 1°C in cold months to reduce continuous compressor load.',
        'habits',
        '{"Owned", "Rented", "Shared"}',
        '{"Zero-Cost"}',
        'Easy',
        240.00,
        4.00,
        0.00,
        TRUE
    ),
    (
        'Cold Water Laundry Cycles',
        'Wash 80% of routine laundry loads in cold water instead of warm/hot cycles. Water heating accounts for up to 90% of washing machine energy.',
        'habits',
        '{"Owned", "Rented", "Shared"}',
        '{"Zero-Cost"}',
        'Easy',
        160.00,
        2.50,
        0.00,
        TRUE
    ),
    (
        'Clean Refrigerator Condenser Coils & Check Gasket',
        'Vacuum dust from behind and beneath the refrigerator twice a year to maintain compressor efficiency and heat dissipation.',
        'appliances',
        '{"Owned", "Rented", "Shared"}',
        '{"Zero-Cost"}',
        'Easy',
        95.00,
        1.50,
        0.00,
        TRUE
    ),
    (
        'Rooftop Solar PV Feasibility Assessment',
        'Explore rooftop solar photovoltaic installation eligibility to offset up to 70% of grid electricity reliance.',
        'electricity',
        '{"Owned"}',
        '{"High"}',
        'Advanced',
        4200.00,
        65.00,
        12000.00,
        TRUE
    );
