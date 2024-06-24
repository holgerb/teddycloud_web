/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TEDDYCLOUD_API_URL: string
    readonly VITE_APP_TEDDYCLOUD_WEB_BASE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
