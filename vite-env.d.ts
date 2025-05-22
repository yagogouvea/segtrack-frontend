/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENCAGE_KEY: string;
  readonly VITE_API_URL: string; // <-- Adicionado aqui
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
