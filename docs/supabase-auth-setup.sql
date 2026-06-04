-- ============================================================
-- Supabase Auth + Profiles 初始化脚本
-- 在 Supabase Dashboard → SQL Editor 中依次执行
-- ============================================================

-- 1. 创建 profiles 表（存储用户扩展信息）
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  avatar_url text,
  sync_key text,          -- 绑定云同步码
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 启用 Row Level Security（行级安全策略）
alter table public.profiles enable row level security;

-- 3. 创建 RLS 策略：用户只能查看自己的 profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- 4. 创建 RLS 策略：用户只能更新自己的 profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 5. 创建 RLS 策略：用户只能插入自己的 profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 6. 自动更新 updated_at 的触发器
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- 7. 注册时自动创建 profile 的触发器
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, sync_key)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    null
  );
  return new;
end;
$$ language plpgsql security definer;

-- 先删除可能存在的旧触发器
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- 如何在 Supabase 中查询 auth.users
-- ============================================================
--
-- 方法 1：Supabase Dashboard → Authentication → Users
--   这是最简单的方式，图形化界面直接查看所有用户
--
-- 方法 2：SQL Editor 中执行以下查询
--
--   查看所有用户基本信息：
--   select * from auth.users;
--
--   查看用户ID和邮箱：
--   select id, email, created_at, last_sign_in_at from auth.users;
--
--   查看用户元数据：
--   select id, email, raw_user_meta_data from auth.users;
--
-- 注意：auth.users 表在 auth schema 中，默认只有服务角色可以访问。
-- 前端/客户端无法直接查询 auth.users，必须通过 profiles 表间接获取用户信息。
--
-- 方法 3：通过 Edge Function 或服务端 API 查询
--   使用 supabase service_role_key 可以查询 auth.users
--   但需要部署在服务端，不要暴露到前端。
--
-- ============================================================
