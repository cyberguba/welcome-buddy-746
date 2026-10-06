CREATE TYPE public.app_role AS ENUM ('hr', 'manager', 'employee');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_manager_of(_manager uuid, _employee uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _employee AND manager_id = _manager)
    AND public.has_role(_manager, 'manager')
$$;

CREATE POLICY "Signed-in users can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "HR updates any profile" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'hr')) WITH CHECK (public.has_role(auth.uid(), 'hr'));

-- Users can't change their own manager unless HR
CREATE OR REPLACE FUNCTION public.guard_profile_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.manager_id IS DISTINCT FROM OLD.manager_id AND NOT public.has_role(auth.uid(), 'hr') THEN
    RAISE EXCEPTION 'Only HR can change managers';
  END IF;
  NEW.email := OLD.email;
  RETURN NEW;
END $$;
CREATE TRIGGER profiles_guard BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_update();

CREATE POLICY "View own roles or HR views all" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'hr') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "HR adds roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'hr'));
CREATE POLICY "HR removes roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'hr'));

-- New user: profile + role (first user becomes HR)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE is_first boolean;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'hr') INTO is_first;
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'employee');
  IF is_first THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'hr');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Onboarding',
  description text NOT NULL DEFAULT '',
  minutes integer NOT NULL DEFAULT 15,
  image_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users view courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR manages courses" ON public.courses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr')) WITH CHECK (public.has_role(auth.uid(), 'hr'));

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  pages integer NOT NULL DEFAULT 1,
  requires_signature boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users view documents" ON public.documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "HR manages documents" ON public.documents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'hr')) WITH CHECK (public.has_role(auth.uid(), 'hr'));

CREATE TABLE public.assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  due_date date,
  progress integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT one_item CHECK ((course_id IS NULL) <> (document_id IS NULL)),
  CONSTRAINT progress_range CHECK (progress BETWEEN 0 AND 100)
);
CREATE UNIQUE INDEX assignments_user_course ON public.assignments(user_id, course_id) WHERE course_id IS NOT NULL;
CREATE UNIQUE INDEX assignments_user_document ON public.assignments(user_id, document_id) WHERE document_id IS NOT NULL;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignments TO authenticated;
GRANT ALL ON public.assignments TO service_role;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own, team or all (HR)" ON public.assignments FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), user_id));
CREATE POLICY "HR or manager assigns" ON public.assignments FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), user_id));
CREATE POLICY "Owner, HR or manager updates" ON public.assignments FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), user_id))
  WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), user_id));
CREATE POLICY "HR or manager removes" ON public.assignments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), user_id));

-- Employees may only change progress on their own rows
CREATE OR REPLACE FUNCTION public.guard_assignment_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), OLD.user_id)) THEN
    IF NEW.user_id <> OLD.user_id OR NEW.due_date IS DISTINCT FROM OLD.due_date
       OR NEW.course_id IS DISTINCT FROM OLD.course_id OR NEW.document_id IS DISTINCT FROM OLD.document_id
       OR NEW.assigned_by IS DISTINCT FROM OLD.assigned_by THEN
      RAISE EXCEPTION 'You can only update your progress';
    END IF;
  END IF;
  IF NEW.progress >= 100 AND NEW.completed_at IS NULL THEN NEW.completed_at := now(); END IF;
  IF NEW.progress < 100 THEN NEW.completed_at := NULL; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER assignments_guard BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.guard_assignment_update();

INSERT INTO public.courses (title, category, description, minutes, image_key) VALUES
  ('Company culture & values', 'Onboarding', 'How we work at Postimees and what we stand for.', 12, 'culture'),
  ('IT security fundamentals', 'Compliance', 'Passwords, phishing and keeping company data safe.', 22, 'security'),
  ('Collaboration suite basics', 'Tools', 'Email, calendar, chat and shared drives.', 15, 'tools'),
  ('Fire safety & evacuation', 'Compliance', 'Emergency exits, alarms and what to do in a fire.', 18, 'safety');

INSERT INTO public.documents (title, description, pages, requires_signature) VALUES
  ('Employment contract', 'Your terms of employment and compensation details.', 12, true),
  ('Code of conduct', 'Our values, expectations, and workplace standards.', 18, true),
  ('NDA & IP agreement', 'Confidentiality and intellectual property ownership.', 4, true),
  ('Employee handbook', 'Leave, benefits, expenses and everyday policies.', 48, false),
  ('Health & safety rules', 'Emergency procedures and safe working practices.', 9, true);