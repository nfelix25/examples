/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly IS_DOCKER: boolean;
  readonly PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
