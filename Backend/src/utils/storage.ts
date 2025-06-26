import fs from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(__dirname, '../data/urls.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Initialize storage with empty data if file doesn't exist
const initializeStorage = () => {
  ensureDataDir();
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({}, null, 2));
  }
};

// Load data from file
export const loadUrlStore = (): Record<string, any> => {
  try {
    initializeStorage();
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading URL store:', error);
    return {};
  }
};

// Save data to file
export const saveUrlStore = (data: Record<string, any>): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving URL store:', error);
  }
};

// Initialize storage on module load
initializeStorage(); 