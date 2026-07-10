import ElectronStore from 'electron-store';

const encryptionKey = process.env.ELECTRON_STORE_ENCRYPTION_KEY || 'coderx-electron-store-v1';

export const store = new ElectronStore<any>({ encryptionKey });
