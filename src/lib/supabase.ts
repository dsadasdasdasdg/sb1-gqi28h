import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase table structure:
/*
create table public.users (
  id uuid references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  status text default 'offline',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

create table public.direct_messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.users(id),
  recipient_id uuid references public.users(id),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table public.user_contacts (
  user_id uuid references public.users(id),
  contact_id uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (user_id, contact_id)
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.direct_messages enable row level security;
alter table public.user_contacts enable row level security;

-- RLS Policies
create policy "Users can view their own data and contacts"
  on public.users for select
  using (
    auth.uid() = id or
    exists (
      select 1 from public.user_contacts
      where (user_id = auth.uid() and contact_id = users.id)
      or (contact_id = auth.uid() and user_id = users.id)
    )
  );

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can send and receive messages"
  on public.direct_messages for select
  using (
    auth.uid() = sender_id or
    auth.uid() = recipient_id
  );

create policy "Users can insert messages"
  on public.direct_messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can manage their contacts"
  on public.user_contacts for all
  using (auth.uid() = user_id);
*/