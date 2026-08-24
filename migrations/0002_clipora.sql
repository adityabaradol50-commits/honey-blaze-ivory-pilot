create table if not exists profiles (
  user_id text primary key,
  plan text not null default 'free',
  credits integer not null default 50,
  videos_this_month integer not null default 0,
  video_limit integer not null default 3,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id text primary key,
  user_id text not null,
  title text not null,
  type text not null,
  status text not null default 'draft',
  script text not null default '',
  voice_id text not null default 'eve',
  voice_data text,
  captions_json text not null default '[]',
  scenes_json text not null default '[]',
  source_url text,
  duration_sec integer not null default 0,
  credits_spent integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_id_idx on projects (user_id);
create index if not exists projects_updated_at_idx on projects (updated_at desc);

create table if not exists credit_events (
  id serial primary key,
  user_id text not null,
  amount integer not null,
  reason text not null,
  project_id text,
  created_at timestamptz not null default now()
);

create index if not exists credit_events_user_id_idx on credit_events (user_id);
