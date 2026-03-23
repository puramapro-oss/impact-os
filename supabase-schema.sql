-- ============================================
-- LUMIOS V5 — Schema Supabase complet
-- À exécuter dans le SQL Editor de Supabase
-- ============================================

-- 1. PROFILS UTILISATEURS (lié à auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text,
  ville text,
  bio text,
  avatar_url text,
  role text default 'Président(e)',
  plan text default 'lumiere' check (plan in ('lumiere', 'etincelle', 'flamme', 'soleil')),
  mode_ia text default 'SAFE' check (mode_ia in ('SAFE', 'AUTOPILOT', 'FULL')),
  actions_used integer default 0,
  actions_reset_at timestamptz default date_trunc('month', now()) + interval '1 month',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. ORGANISATIONS
create table public.organisations (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  siret text,
  adresse text,
  email_contact text,
  telephone text,
  secteur text,
  nombre_membres integer default 0,
  nombre_benevoles integer default 0,
  budget_annuel numeric default 0,
  logo_url text,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. MEMBRES
create table public.membres (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  prenom text not null,
  nom text not null,
  email text,
  telephone text,
  role text default 'Adhérent',
  statut text default 'Actif' check (statut in ('Actif', 'Inactif')),
  cotisation text default 'À jour' check (cotisation in ('À jour', 'En retard', 'Expiré')),
  date_inscription date default current_date,
  heures_benevolat integer default 0,
  created_at timestamptz default now()
);

-- 4. DOCUMENTS
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  nom text not null,
  dossier text not null,
  type text default 'PDF',
  taille text,
  statut text default 'Finalisé',
  fichier_url text,
  genere_par_ia boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 5. WORKFLOWS / AUTOMATISATIONS
create table public.workflows (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  nom text not null,
  description text,
  actif boolean default true,
  frequence text default 'Quotidien',
  derniere_execution timestamptz,
  prochaine_execution timestamptz,
  created_at timestamptz default now()
);

-- 6. SUBVENTIONS
create table public.subventions (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  nom text not null,
  organisme text,
  montant numeric default 0,
  statut text default 'Brouillon' check (statut in ('Brouillon', 'En cours', 'Soumis', 'Accordée', 'Refusée')),
  echeance date,
  progression integer default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. EMAILS
create table public.emails (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  expediteur text not null,
  email_expediteur text,
  objet text not null,
  resume text,
  contenu text,
  priorite text default 'moyenne' check (priorite in ('haute', 'moyenne', 'basse')),
  categorie text default 'traiter' check (categorie in ('traiter', 'traites', 'archives')),
  lu boolean default false,
  actions_suggerees text[],
  created_at timestamptz default now()
);

-- 8. JOURNAL D'AUDIT
create table public.audit_log (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  utilisateur text not null,
  action text not null,
  details text,
  type text default 'utilisateur' check (type in ('ia', 'utilisateur')),
  niveau text default 'info' check (niveau in ('info', 'success', 'warning', 'error')),
  created_at timestamptz default now()
);

-- 9. HISTORIQUE RESOUTRE
create table public.resoutre_historique (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  organisation_id uuid references public.organisations(id) on delete cascade,
  question text not null,
  reponse text,
  documents_generes text[],
  statut text default 'En cours' check (statut in ('En cours', 'Résolu')),
  credits_utilises integer default 2,
  created_at timestamptz default now()
);

-- 10. USAGE / QUOTAS
create table public.usage_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  organisation_id uuid references public.organisations(id) on delete cascade,
  action_type text not null check (action_type in ('resoutre', 'document', 'email', 'automation', 'search')),
  credits numeric not null,
  description text,
  created_at timestamptz default now()
);

-- 11. INDICATEURS D'IMPACT
create table public.indicateurs_impact (
  id uuid default gen_random_uuid() primary key,
  organisation_id uuid references public.organisations(id) on delete cascade not null,
  label text not null,
  valeur numeric default 0,
  objectif numeric default 0,
  unite text,
  tendance numeric default 0,
  mois date default date_trunc('month', current_date),
  created_at timestamptz default now()
);

-- ============================================
-- FONCTION : Créer un profil auto à l'inscription
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, prenom, nom, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'prenom', ''),
    coalesce(new.raw_user_meta_data->>'nom', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger : après chaque inscription
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- RLS (Row Level Security)
-- ============================================

-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.organisations enable row level security;
alter table public.membres enable row level security;
alter table public.documents enable row level security;
alter table public.workflows enable row level security;
alter table public.subventions enable row level security;
alter table public.emails enable row level security;
alter table public.audit_log enable row level security;
alter table public.resoutre_historique enable row level security;
alter table public.usage_log enable row level security;
alter table public.indicateurs_impact enable row level security;

-- PROFILES : chacun voit/modifie le sien
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ORGANISATIONS : owner voit/modifie
create policy "Owner can manage organisation"
  on public.organisations for all using (auth.uid() = owner_id);

create policy "Owner can insert organisation"
  on public.organisations for insert with check (auth.uid() = owner_id);

-- Tables liées à l'organisation : accès via owner
create policy "Org members access" on public.membres
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

create policy "Org documents access" on public.documents
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

create policy "Org workflows access" on public.workflows
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

create policy "Org subventions access" on public.subventions
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

create policy "Org emails access" on public.emails
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

create policy "Org audit access" on public.audit_log
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

create policy "Org impact access" on public.indicateurs_impact
  for all using (
    organisation_id in (select id from public.organisations where owner_id = auth.uid())
  );

-- RESOUTRE : chacun voit le sien
create policy "Users own resoutre history"
  on public.resoutre_historique for all using (auth.uid() = user_id);

-- USAGE : chacun voit le sien
create policy "Users own usage"
  on public.usage_log for all using (auth.uid() = user_id);

-- ============================================
-- INDEX pour performance
-- ============================================
create index idx_membres_org on public.membres(organisation_id);
create index idx_documents_org on public.documents(organisation_id);
create index idx_workflows_org on public.workflows(organisation_id);
create index idx_subventions_org on public.subventions(organisation_id);
create index idx_emails_org on public.emails(organisation_id);
create index idx_audit_org on public.audit_log(organisation_id);
create index idx_audit_created on public.audit_log(created_at desc);
create index idx_usage_user on public.usage_log(user_id);
create index idx_usage_created on public.usage_log(created_at desc);
create index idx_resoutre_user on public.resoutre_historique(user_id);
create index idx_impact_org on public.indicateurs_impact(organisation_id);

-- ============================================
-- STORAGE : Bucket pour les documents
-- ============================================
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

create policy "Authenticated users can upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

create policy "Users can view own documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents');
