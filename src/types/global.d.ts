/*
export {};
declare global {
  interface Window {
    electronAPI?: {
      openFileDialog: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>;
    };
  }
}
*/

export {};

declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<any>;
      send: (channel: string, data?: unknown) => void;
      invoke: (channel: string, data?: unknown) => Promise<any>;
      removeAll: (channel: string) => void;
      openFileDialog: (options: Electron.OpenDialogOptions) => Promise<any>;
    };
  }
  interface File {
    path?: string;
  }
}
