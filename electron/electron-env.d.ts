/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

interface Window {
  data: {
    listen: (callback: (address: string, device: Devices[]) => void) => void;
    ready: () => void;
    removeDataListener: () => void;
    refresh: () => void;
    message: (
      callback: (
        success: boolean,
        method: "request" | "refresh",
        message: string
      ) => void
    ) => void;
    removeMesListener: () => void;
    getIcon: () => Promise<string>;
  };

  store: {
    updateId: (id: number) => void;
    getId: () => Promise<number | undefined>;
    getNotification: () => Promise<boolean | undefined>;
    setNotification: (notification: boolean) => void;
    setInterval: (interval: number) => void;
    getInterval: () => Promise<number>;
    setCloseAction: (action: string) => void;
    getCloseAction: () => Promise<string>;
  };
}
