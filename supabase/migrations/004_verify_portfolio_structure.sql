-- Verify table structure
select exists (
    select from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'portfolios'
);

-- If needed, recreate the table
create table if not exists public.portfolios (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    holdings jsonb default '[]'::jsonb,
    settings jsonb default '{"currency": "USD", "refresh_interval": 60000}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- First, drop all existing policies
drop policy if exists "Enable insert for authenticated users" on public.portfolios;
drop policy if exists "Enable read access for own portfolios" on public.portfolios;
drop policy if exists "Enable update access for own portfolios" on public.portfolios;
drop policy if exists "Enable delete access for own portfolios" on public.portfolios;
drop policy if exists "Users can view their own portfolio" on public.portfolios;
drop policy if exists "Users can insert their own portfolio" on public.portfolios;
drop policy if exists "Users can update their own portfolio" on public.portfolios;

-- Create a single, simplified policy that handles all operations
create policy "Users can manage their own portfolios"
    on public.portfolios
    for all -- this covers SELECT, INSERT, UPDATE, and DELETE
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Ensure proper permissions are granted to authenticated users
grant all on public.portfolios to authenticated;

-- Verify RLS is enabled
alter table public.portfolios enable row level security;
