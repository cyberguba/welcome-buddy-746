-- TEMPORARY DEMO MODE: no sign-in, anyone can read/write. Remove before real use.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles, public.user_roles, public.courses, public.documents, public.assignments TO anon;

CREATE POLICY "Demo open profiles" ON public.profiles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Demo open roles" ON public.user_roles FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Demo open courses" ON public.courses FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Demo open documents" ON public.documents FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Demo open assignments" ON public.assignments FOR ALL TO anon USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS profiles_guard ON public.profiles;

CREATE OR REPLACE FUNCTION public.guard_assignment_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT (public.has_role(auth.uid(), 'hr') OR public.is_manager_of(auth.uid(), OLD.user_id)) THEN
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

-- Demo people
INSERT INTO public.profiles (id, full_name, email) VALUES
 ('00000000-0000-0000-0000-000000000001','Kadri Tamm','kadri.tamm@postimees.ee'),
 ('00000000-0000-0000-0000-000000000002','Martin Kask','martin.kask@postimees.ee');
INSERT INTO public.profiles (id, full_name, email, manager_id) VALUES
 ('00000000-0000-0000-0000-000000000003','Liis Saar','liis.saar@postimees.ee','00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000004','Andres Mets','andres.mets@postimees.ee','00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000005','Maria Ilves','maria.ilves@postimees.ee','00000000-0000-0000-0000-000000000002');
INSERT INTO public.user_roles (user_id, role) VALUES
 ('00000000-0000-0000-0000-000000000001','hr'),('00000000-0000-0000-0000-000000000001','employee'),
 ('00000000-0000-0000-0000-000000000002','manager'),('00000000-0000-0000-0000-000000000002','employee'),
 ('00000000-0000-0000-0000-000000000003','employee'),('00000000-0000-0000-0000-000000000004','employee'),
 ('00000000-0000-0000-0000-000000000005','employee');

INSERT INTO public.assignments (user_id, course_id, due_date, progress, assigned_by)
SELECT p.id, c.id, current_date + 14, (CASE WHEN p.id::text LIKE '%3' THEN 100 WHEN p.id::text LIKE '%4' THEN 40 ELSE 0 END), '00000000-0000-0000-0000-000000000001'
FROM public.profiles p CROSS JOIN public.courses c WHERE p.id::text LIKE '00000000-0000-0000-0000-00000000000%';
INSERT INTO public.assignments (user_id, document_id, due_date, progress, assigned_by)
SELECT p.id, d.id, current_date + 7, (CASE WHEN p.id::text LIKE '%3' THEN 100 ELSE 0 END), '00000000-0000-0000-0000-000000000001'
FROM public.profiles p CROSS JOIN public.documents d WHERE p.id::text LIKE '00000000-0000-0000-0000-00000000000%';