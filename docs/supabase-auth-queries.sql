-- ============================================================
-- auth.users 常用查询语句
-- 在 Supabase Dashboard → SQL Editor 中执行
--
-- 注意：auth.users 在 auth schema 中，需要足够权限才能查询。
-- Supabase Dashboard 的 SQL Editor 默认有权限，前端/客户端无权限。
-- ============================================================

-- 1. 查看所有用户（基础信息）
select
  id,
  email,
  created_at,
  updated_at,
  last_sign_at_at,
  email_confirmed_at,
  raw_user_meta_data->>'username' as username
from auth.users;

-- 2. 查看最近注册的用户（按时间倒序）
select
  id,
  email,
  created_at,
  raw_user_meta_data->>'username' as username
from auth.users
order by created_at desc
limit 20;

-- 3. 查看未验证邮箱的用户
select
  id,
  email,
  created_at,
  confirmation_sent_at
from auth.users
where email_confirmed_at is null;

-- 4. 查看某个邮箱对应的用户
select *
from auth.users
where email = 'your-email@example.com';

-- 5. 查看某个用户ID对应的完整信息
select *
from auth.users
where id = '00000000-0000-0000-0000-000000000000';

-- 6. 查看用户元数据（注册时传入的 username 等）
select
  id,
  email,
  raw_user_meta_data
from auth.users;

-- 7. 统计用户总数
select count(*) as total_users from auth.users;

-- 8. 统计今日注册用户数
select count(*) as today_users
from auth.users
where created_at >= date_trunc('day', now());

-- 9. 关联 profiles 表查询（推荐，能看到扩展信息）
select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  p.username,
  p.avatar_url,
  p.sync_key,
  p.created_at as profile_created_at
from auth.users u
left join public.profiles p on u.id = p.id
order by u.created_at desc;

-- 10. 只查有 profile 记录的用户
select
  u.id,
  u.email,
  p.username,
  p.avatar_url,
  p.sync_key
from auth.users u
inner join public.profiles p on u.id = p.id;

-- 11. 查没有 profile 的用户（需要手动补创建）
select
  u.id,
  u.email,
  split_part(u.email, '@', 1) as suggested_username
from auth.users u
left join public.profiles p on u.id = p.id
where p.id is null;

-- 12. 删除某个用户（谨慎操作）
-- delete from auth.users where id = 'uuid-here';

-- 13. 强制确认某个用户的邮箱（跳过验证邮件）
-- update auth.users
-- set email_confirmed_at = now(), confirmed_at = now()
-- where id = 'uuid-here';
