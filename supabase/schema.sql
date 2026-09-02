-- Rode este script no Supabase: Dashboard > SQL Editor > New query > Run.
-- Cria as tabelas usadas pelo backend "supabase" (stores/supabaseStore.js).

create table if not exists sessions (
  session_id uuid primary key default gen_random_uuid(),
  nome text,
  email text not null,
  telefone text,
  vaga text,
  status text not null default 'EM_ANDAMENTO',
  etapa_atual text not null default 'disc',
  questao_atual int not null default 0,
  respostas jsonb not null default '{"disc":{},"fit_cultural":{},"logic":{}}',
  criado_em timestamptz not null default now(),
  ultima_atividade timestamptz not null default now()
);
create unique index if not exists sessions_email_idx on sessions (lower(email));

create table if not exists results (
  id text primary key,
  data jsonb not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);
create index if not exists results_email_idx on results (lower(email));

create table if not exists job_positions (
  nome text primary key
);
insert into job_positions (nome) values ('Social Media')
  on conflict (nome) do nothing;

-- RLS fica desligado por padrão nessas tabelas (o backend acessa via service_role
-- key, que ignora RLS de qualquer forma). Se quiser travar o acesso via anon key
-- também, habilite RLS e não crie policies (nega tudo exceto service_role).
