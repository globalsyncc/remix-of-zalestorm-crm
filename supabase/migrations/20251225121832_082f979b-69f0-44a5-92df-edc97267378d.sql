-- Create companies table (tenants)
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user info + company membership
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  job_title TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'member',
  UNIQUE (user_id, role)
);

-- Create contacts table (multi-tenant)
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  job_title TEXT,
  status TEXT DEFAULT 'active',
  source TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_companies table (companies managed in CRM, multi-tenant)
CREATE TABLE public.client_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT,
  logo_url TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  annual_revenue NUMERIC,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deals table (multi-tenant)
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  stage TEXT DEFAULT 'lead',
  probability INTEGER DEFAULT 10,
  expected_close_date DATE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  client_company_id UUID REFERENCES public.client_companies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activities table (multi-tenant)
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'call', 'email', 'meeting', 'note', 'task'
  subject TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed BOOLEAN DEFAULT false,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Security definer function to get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company"
ON public.companies FOR SELECT
USING (id = public.get_user_company_id());

CREATE POLICY "Owners/Admins can update their company"
ON public.companies FOR UPDATE
USING (id = public.get_user_company_id() AND (public.has_role(auth.uid(), 'owner') OR public.has_role(auth.uid(), 'admin')));

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their company"
ON public.profiles FOR SELECT
USING (company_id = public.get_user_company_id() OR id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

-- RLS Policies for contacts (tenant-scoped)
CREATE POLICY "Users can view contacts in their company"
ON public.contacts FOR SELECT
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can create contacts in their company"
ON public.contacts FOR INSERT
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update contacts in their company"
ON public.contacts FOR UPDATE
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete contacts in their company"
ON public.contacts FOR DELETE
USING (company_id = public.get_user_company_id());

-- RLS Policies for client_companies (tenant-scoped)
CREATE POLICY "Users can view client companies in their company"
ON public.client_companies FOR SELECT
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can create client companies in their company"
ON public.client_companies FOR INSERT
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update client companies in their company"
ON public.client_companies FOR UPDATE
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete client companies in their company"
ON public.client_companies FOR DELETE
USING (company_id = public.get_user_company_id());

-- RLS Policies for deals (tenant-scoped)
CREATE POLICY "Users can view deals in their company"
ON public.deals FOR SELECT
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can create deals in their company"
ON public.deals FOR INSERT
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update deals in their company"
ON public.deals FOR UPDATE
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete deals in their company"
ON public.deals FOR DELETE
USING (company_id = public.get_user_company_id());

-- RLS Policies for activities (tenant-scoped)
CREATE POLICY "Users can view activities in their company"
ON public.activities FOR SELECT
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can create activities in their company"
ON public.activities FOR INSERT
WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Users can update activities in their company"
ON public.activities FOR UPDATE
USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can delete activities in their company"
ON public.activities FOR DELETE
USING (company_id = public.get_user_company_id());

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  
  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_client_companies_updated_at BEFORE UPDATE ON public.client_companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX idx_contacts_company_id ON public.contacts(company_id);
CREATE INDEX idx_client_companies_company_id ON public.client_companies(company_id);
CREATE INDEX idx_deals_company_id ON public.deals(company_id);
CREATE INDEX idx_activities_company_id ON public.activities(company_id);