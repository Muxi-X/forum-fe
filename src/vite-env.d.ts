/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

interface ImportMetaEnv {
  readonly VITE_STUDENT_LOGIN_PROVIDER?: 'legacy' | 'oauth';
  readonly VITE_STUDENT_OAUTH_CALLBACK_URL?: string;
  readonly VITE_API_PROXY_TARGET?: string;
  readonly VITE_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
