-- First, drop existing policies if any
drop policy if exists "Users can view their own portfolio" on public.portfolios;
drop policy if exists "Users can insert their own portfolio" on public.portfolios;
drop policy if exists "Users can update their own portfolio" on public.portfolios;

-- Create a more permissive policy for insert
create policy "Enable insert for authenticated users"
    on public.portfolios
    for insert
    with check (auth.uid() = user_id);

-- Create policy for select
create policy "Enable read access for own portfolios"
    on public.portfolios
    for select
    using (auth.uid() = user_id);

-- Create policy for update
create policy "Enable update access for own portfolios"
    on public.portfolios
    for update
    using (auth.uid() = user_id);

-- Create policy for delete (if needed)
create policy "Enable delete access for own portfolios"
    on public.portfolios
    for delete
    using (auth.uid() = user_id);