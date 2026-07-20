# Supabase Setup

This project now stores application data in Supabase instead of `localStorage`.

## What to create in Supabase

### 1) Tables

#### `profiles`
Use this table for the user profile and resume data.

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `user_id` | `uuid` | Unique, references `auth.users(id)` |
| `full_name` | `text` | User display name |
| `headline` | `text` | Short profile headline |
| `avatar_url` | `text` | Public or signed avatar URL |
| `avatar_storage_path` | `text` | Storage path for avatar |
| `resume_url` | `text` | Resume file URL |
| `resume_storage_path` | `text` | Resume storage path |
| `country` | `text` | Country dropdown value |
| `province` | `text` | Province/state |
| `nationality` | `text` | Nationality dropdown value |
| `date_of_birth` | `date` | Optional |
| `gender` | `text` | Gender dropdown value |
| `address` | `text` | Full address |
| `summary` | `text` | Profile summary |
| `skills` | `text` | Comma-separated skills |
| `experience` | `text` | Comma-separated experience titles |
| `education` | `text` | Comma-separated education titles |
| `certifications` | `text` | Comma-separated certification titles |
| `awards` | `text` | Comma-separated award titles |
| `languages` | `text` | Comma-separated languages |
| `documents` | `text` | Comma-separated document titles |
| `portfolio_url` | `text` | Portfolio link |
| `linkedin_url` | `text` | LinkedIn link |
| `github_url` | `text` | GitHub link |
| `twitter_url` | `text` | Twitter/X link |
| `intro_video_url` | `text` | Optional intro video |
| `location` | `text` | Main location |
| `phone` | `text` | Phone number |
| `bio` | `text` | Bio field |
| `resume_template` | `text` | `classic`, `modern`, or `compact` |
| `theme_mode` | `text` | `light` or `dark` |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `experience_entries`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `profile_id` | `uuid` | References `profiles(id)` |
| `position` | `text` | Job title |
| `organization` | `text` | Company name |
| `employment_type` | `text` | Full-time, Part-time, etc. |
| `currently_working` | `boolean` | True if current role |
| `start_date` | `date` | Start date |
| `end_date` | `date` | Optional |
| `country` | `text` | Country |
| `province` | `text` | Province/state |
| `skills` | `text` | Skills used in the role |
| `description` | `text` | Responsibilities |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `education_entries`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `profile_id` | `uuid` | References `profiles(id)` |
| `degree` | `text` | Degree name |
| `institution` | `text` | School or university |
| `field_of_study` | `text` | Field of study |
| `country` | `text` | Country |
| `province` | `text` | Province/state |
| `start_date` | `date` | Start date |
| `end_date` | `date` | Optional |
| `description` | `text` | Notes |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `certification_entries`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `profile_id` | `uuid` | References `profiles(id)` |
| `title` | `text` | Certification title |
| `certification_url` | `text` | Optional credential link |
| `credential_id` | `text` | Optional credential ID |
| `issuing_organization` | `text` | Issuer |
| `issue_date` | `date` | Issue date |
| `expiration_date` | `date` | Optional |
| `description` | `text` | Notes |
| `attachment_url` | `text` | Uploaded file URL |
| `attachment_storage_path` | `text` | Storage path |
| `attachment_file_name` | `text` | Original file name |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `award_entries`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `profile_id` | `uuid` | References `profiles(id)` |
| `title` | `text` | Award title |
| `issued_by` | `text` | Issuer |
| `date` | `date` | Award date |
| `description` | `text` | Notes |
| `reference_url` | `text` | Optional reference link |
| `attachment_url` | `text` | Uploaded file URL |
| `attachment_storage_path` | `text` | Storage path |
| `attachment_file_name` | `text` | Original file name |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `document_entries`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key |
| `profile_id` | `uuid` | References `profiles(id)` |
| `title` | `text` | Document title |
| `document_type` | `text` | CV, National ID, Passport, etc. |
| `description` | `text` | Optional notes |
| `attachment_url` | `text` | Uploaded file URL |
| `attachment_storage_path` | `text` | Storage path |
| `attachment_file_name` | `text` | Original file name |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `opportunities`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Primary key, matches the app-generated opportunity ID |
| `title` | `text` | Opportunity title |
| `organization` | `text` | Organization name |
| `category` | `text` | Job, Scholarship, Internship, etc. |
| `location` | `text` | Location |
| `type` | `text` | Remote, On-site, Hybrid, Online |
| `published_at` | `date` | Optional publication date |
| `gender` | `text` | Optional gender restriction |
| `level` | `text` | Optional job level |
| `deadline` | `date` | Deadline |
| `description` | `text` | Main description |
| `responsibilities` | `text[]` | Optional list |
| `requirements` | `text[]` | Required items |
| `skills` | `text[]` | Preferred skills |
| `documents_required` | `text[]` | Required documents |
| `company_summary` | `text` | Optional company summary |
| `apply_link` | `text` | Apply URL |
| `tags` | `text[]` | Optional tags |
| `featured` | `boolean` | Featured flag |
| `submitted_at` | `timestamptz` | App submission timestamp |
| `user_id` | `uuid` | Optional author reference |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Updated automatically |

#### `saved_opportunities`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `user_id` | `uuid` | References `auth.users(id)` |
| `opportunity_id` | `text` | References `opportunities(id)` |
| `created_at` | `timestamptz` | Default `now()` |

Primary key: `(user_id, opportunity_id)`

#### `followed_organizations`

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `user_id` | `uuid` | References `auth.users(id)` |
| `organization_slug` | `text` | Organization slug |
| `created_at` | `timestamptz` | Default `now()` |

Primary key: `(user_id, organization_slug)`

---

## SQL Editor script

Run the following in the Supabase SQL Editor.

```sql
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  headline text,
  avatar_url text,
  avatar_storage_path text,
  resume_url text,
  resume_storage_path text,
  country text,
  province text,
  nationality text,
  date_of_birth date,
  gender text,
  address text,
  summary text,
  skills text,
  experience text,
  education text,
  certifications text,
  awards text,
  languages text,
  documents text,
  portfolio_url text,
  linkedin_url text,
  github_url text,
  twitter_url text,
  intro_video_url text,
  location text,
  phone text,
  bio text,
  resume_template text not null default 'modern',
  theme_mode text not null default 'light',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position text not null,
  organization text not null,
  employment_type text not null,
  currently_working boolean not null default false,
  start_date date not null,
  end_date date,
  country text not null,
  province text not null,
  skills text not null default '',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  degree text not null,
  institution text not null,
  field_of_study text not null,
  country text not null,
  province text not null,
  start_date date not null,
  end_date date,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certification_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  certification_url text,
  credential_id text,
  issuing_organization text not null,
  issue_date date not null,
  expiration_date date,
  description text not null default '',
  attachment_url text not null default '',
  attachment_storage_path text not null default '',
  attachment_file_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.award_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  issued_by text not null,
  date date not null,
  description text not null default '',
  reference_url text,
  attachment_url text not null default '',
  attachment_storage_path text not null default '',
  attachment_file_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  document_type text not null,
  description text not null default '',
  attachment_url text not null default '',
  attachment_storage_path text not null default '',
  attachment_file_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id text primary key,
  title text not null,
  organization text not null,
  category text not null,
  location text not null,
  type text not null,
  published_at date,
  gender text,
  level text,
  deadline date not null,
  description text not null,
  responsibilities text[],
  requirements text[],
  skills text[],
  documents_required text[],
  company_summary text,
  apply_link text not null,
  tags text[],
  featured boolean not null default false,
  submitted_at timestamptz,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_opportunities (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table if not exists public.followed_organizations (
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, organization_slug)
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_experience_entries_updated_at on public.experience_entries;
create trigger set_experience_entries_updated_at
before update on public.experience_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_education_entries_updated_at on public.education_entries;
create trigger set_education_entries_updated_at
before update on public.education_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_certification_entries_updated_at on public.certification_entries;
create trigger set_certification_entries_updated_at
before update on public.certification_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_award_entries_updated_at on public.award_entries;
create trigger set_award_entries_updated_at
before update on public.award_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_document_entries_updated_at on public.document_entries;
create trigger set_document_entries_updated_at
before update on public.document_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_opportunities_updated_at on public.opportunities;
create trigger set_opportunities_updated_at
before update on public.opportunities
for each row execute function public.set_updated_at();
```

---

## RLS policies

```sql
alter table public.profiles enable row level security;
alter table public.experience_entries enable row level security;
alter table public.education_entries enable row level security;
alter table public.certification_entries enable row level security;
alter table public.award_entries enable row level security;
alter table public.document_entries enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.followed_organizations enable row level security;

create policy "Public can read opportunities"
on public.opportunities
for select
to anon, authenticated
using (true);

create policy "Authenticated users can create opportunities"
on public.opportunities
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own opportunities"
on public.opportunities
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own opportunities"
on public.opportunities
for delete
to authenticated
using (user_id = auth.uid());

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own profile"
on public.profiles
for delete
to authenticated
using (user_id = auth.uid());

create policy "Users can read their own experience entries"
on public.experience_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can write their own experience entries"
on public.experience_entries
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can read their own education entries"
on public.education_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can write their own education entries"
on public.education_entries
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can read their own certification entries"
on public.certification_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can write their own certification entries"
on public.certification_entries
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can read their own award entries"
on public.award_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can write their own award entries"
on public.award_entries
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can read their own document entries"
on public.document_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can write their own document entries"
on public.document_entries
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_id
      and p.user_id = auth.uid()
  )
);

create policy "Users can read their own saved opportunities"
on public.saved_opportunities
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can write their own saved opportunities"
on public.saved_opportunities
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can read their own followed organizations"
on public.followed_organizations
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can write their own followed organizations"
on public.followed_organizations
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

---

## Quick SQL tests

Replace `YOUR_USER_UUID` with a real authenticated user id.

### Create profile

```sql
insert into public.profiles (
  user_id,
  full_name,
  headline,
  country,
  province,
  nationality,
  gender,
  summary,
  skills,
  languages,
  bio,
  resume_template,
  theme_mode
)
values (
  'YOUR_USER_UUID',
  'KaarYab User',
  'Afghan job seeker',
  'Afghanistan',
  'Kabul',
  'Afghan',
  'Prefer not to say',
  'Experienced professional looking for work in Afghanistan.',
  'Communication, Teamwork, Microsoft Office',
  'Dari, Pashto, English',
  'Experienced professional looking for work in Afghanistan.',
  'modern',
  'light'
)
on conflict (user_id)
do update set
  full_name = excluded.full_name,
  headline = excluded.headline,
  country = excluded.country,
  province = excluded.province,
  nationality = excluded.nationality,
  gender = excluded.gender,
  summary = excluded.summary,
  skills = excluded.skills,
  languages = excluded.languages,
  bio = excluded.bio,
  resume_template = excluded.resume_template,
  theme_mode = excluded.theme_mode;

select * from public.profiles where user_id = 'YOUR_USER_UUID';
```

### Create experience

```sql
insert into public.experience_entries (
  profile_id,
  position,
  organization,
  employment_type,
  currently_working,
  start_date,
  end_date,
  country,
  province,
  skills,
  description
)
select
  id,
  'Frontend Developer',
  'KaarYab',
  'Full-time',
  true,
  '2025-01-01',
  null,
  'Afghanistan',
  'Kabul',
  'React, Next.js, TypeScript',
  'Built the job portal interface.'
from public.profiles
where user_id = 'YOUR_USER_UUID';

select * from public.experience_entries order by created_at desc;
```

### Create certification

```sql
insert into public.certification_entries (
  profile_id,
  title,
  certification_url,
  credential_id,
  issuing_organization,
  issue_date,
  expiration_date,
  description,
  attachment_url,
  attachment_storage_path,
  attachment_file_name
)
select
  id,
  'Professional Web Development',
  'https://example.com/certificate',
  'CERT-1001',
  'Example Academy',
  '2025-05-01',
  null,
  'Completed an advanced web development course.',
  'https://example.com/file.pdf',
  'YOUR_USER_UUID/certifications/file.pdf',
  'file.pdf'
from public.profiles
where user_id = 'YOUR_USER_UUID';

select * from public.certification_entries order by created_at desc;
```

### Save and follow

```sql
insert into public.opportunities (
  id,
  title,
  organization,
  category,
  location,
  type,
  deadline,
  description,
  apply_link,
  featured,
  submitted_at,
  user_id
)
values (
  'opp-test-001',
  'Frontend Developer',
  'KaarYab',
  'Job',
  'Kabul',
  'Remote',
  '2026-12-31',
  'Build the frontend for the platform.',
  'https://example.com/apply',
  false,
  now(),
  'YOUR_USER_UUID'
)
on conflict (id) do nothing;

insert into public.saved_opportunities (user_id, opportunity_id)
values ('YOUR_USER_UUID', 'opp-test-001')
on conflict do nothing;

insert into public.followed_organizations (user_id, organization_slug)
values ('YOUR_USER_UUID', 'kaaryab-afghanistan')
on conflict do nothing;

select * from public.saved_opportunities where user_id = 'YOUR_USER_UUID';
select * from public.followed_organizations where user_id = 'YOUR_USER_UUID';
```

---

## Storage buckets

Create these buckets in Supabase Storage:

- `avatars`
- `resumes`
- `profile-attachments`

If you want public files, set the matching `NEXT_PUBLIC_SUPABASE_*_BUCKET_PUBLIC=true` value in `.env.local`.

---

## Storage policies

Run this in the Supabase SQL Editor after creating the buckets.

```sql
alter table storage.objects enable row level security;

drop policy if exists "Avatar owners can upload their files" on storage.objects;
create policy "Avatar owners can upload their files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Avatar owners can read their files" on storage.objects;
create policy "Avatar owners can read their files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Avatar owners can update their files" on storage.objects;
create policy "Avatar owners can update their files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Avatar owners can delete their files" on storage.objects;
create policy "Avatar owners can delete their files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Resume owners can upload their files" on storage.objects;
create policy "Resume owners can upload their files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Resume owners can read their files" on storage.objects;
create policy "Resume owners can read their files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Resume owners can update their files" on storage.objects;
create policy "Resume owners can update their files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Resume owners can delete their files" on storage.objects;
create policy "Resume owners can delete their files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Attachment owners can upload their files" on storage.objects;
create policy "Attachment owners can upload their files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Attachment owners can read their files" on storage.objects;
create policy "Attachment owners can read their files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Attachment owners can update their files" on storage.objects;
create policy "Attachment owners can update their files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Attachment owners can delete their files" on storage.objects;
create policy "Attachment owners can delete their files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

If you want a bucket to be fully public, you can still keep the upload/delete policies above and simply set the bucket to public inside Supabase Storage. The app will use public URLs when the corresponding `NEXT_PUBLIC_SUPABASE_*_BUCKET_PUBLIC=true` flag is enabled.
