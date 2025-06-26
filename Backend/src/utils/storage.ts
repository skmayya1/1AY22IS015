import fs from 'fs';
import path from 'path';
import { Log } from '../../../MiddlewareLogger';

const STORE_FILE = path.join(__dirname, '../../url-store.json');

interface UrlData {
  originalUrl: string;
  visits: number;
  referers: string[];
  timestamps: string[];
  expiresAt: string;
}

interface UrlStore {
  [key: string]: UrlData;
}

export function loadUrlStore(): UrlStore {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8');
      const store = JSON.parse(data);
      Log({
        stack: "backend",
        level: "info",
        package: "utils",
        message: `URL store loaded successfully with ${Object.keys(store).length} entries`
      });
      return store;
    }
  } catch (error) {
    Log({
      stack: "backend",
      level: "error",
      package: "utils",
      message: `Failed to load URL store: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
  return {};
}

export function saveUrlStore(store: UrlStore): void {
  try {
    const dir = path.dirname(STORE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
    Log({
      stack: "backend",
      level: "info",
      package: "utils",
      message: `URL store saved successfully with ${Object.keys(store).length} entries`
    });
  } catch (error) {
    Log({
      stack: "backend",
      level: "error",
      package: "utils",
      message: `Failed to save URL store: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
} 