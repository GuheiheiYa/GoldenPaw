/**
 * Vite 环境变量类型声明
 * 在 .env 中定义的环境变量需要在这里声明类型，才能在代码中获得 TypeScript 提示
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_DEEPSEEK_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
