-- Create tables
create table public.portfolios (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    holdings jsonb default '[]'::jsonb,
    settings jsonb default '{"currency": "USD", "refresh_interval": 60000}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.price_alerts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    coin_id text not null,
    price decimal not null,
    condition text check (condition in ('above', 'below')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS (Row Level Security)
alter table public.portfolios enable row level security;
alter table public.price_alerts enable row level security;

-- Create policies
create policy "Users can view their own portfolio"
    on public.portfolios for select
    using (auth.uid() = user_id);

create policy "Users can update their own portfolio"
    on public.portfolios for update
    using (auth.uid() = user_id);

create policy "Users can insert their own portfolio"
    on public.portfolios for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own alerts"
    on public.price_alerts for select
    using (auth.uid() = user_id);

create policy "Users can manage their own alerts"
    on public.price_alerts for all
    using (auth.uid() = user_id);

-- Create indexes
create index portfolios_user_id_idx on public.portfolios(user_id);
create index price_alerts_user_id_idx on public.price_alerts(user_id);