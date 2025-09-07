/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global types for browser environment
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

// Timer types for setTimeout/setInterval
declare function setTimeout(callback: () => void, ms?: number): number
declare function clearTimeout(id: number): void
declare function setInterval(callback: () => void, ms?: number): number
declare function clearInterval(id: number): void
