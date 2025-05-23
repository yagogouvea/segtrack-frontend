/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENCAGE_KEY?: string;
  readonly VITE_API_BASE_URL: string;
  // Adicione outras variáveis aqui se quiser
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
