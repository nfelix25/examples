/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BE_PORT: number;
  readonly PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
