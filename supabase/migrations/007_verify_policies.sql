-- Check existing policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
and tablename = 'portfolios';

-- Check table structure and permissions
\d+ public.portfolios;