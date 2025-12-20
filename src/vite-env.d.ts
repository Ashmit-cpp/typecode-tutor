/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CLERK_JWT_ISSUER_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
