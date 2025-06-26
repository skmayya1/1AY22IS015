import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { loadUrlStore, saveUrlStore } from '../utils/storage';

const router = Router();

// Load initial data from storage
export let urlStore = loadUrlStore();

// Helper function to check if URL is expired
export const isUrlExpired = (id: string): boolean => {
  const data = urlStore[id];
  if (!data) return true;
  return new Date() > new Date(data.expiresAt);
};

// Helper function to save changes
const saveChanges = () => {
  saveUrlStore(urlStore);
};

router.post('/', (req: Request, res: Response) => {
  const { originalUrl, expiryMinutes } = req.body;
  if (!originalUrl) {
    res.status(400).json({ error: 'originalUrl is required' });
    return;
  }

  // Default expiry of 30 minutes if not specified
  const expiry = expiryMinutes ? parseInt(expiryMinutes) : 30;
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expiry);
  
  const id = nanoid(7);
  urlStore[id] = {
    originalUrl,
    visits: 0,
    referers: [],
    timestamps: [],
    expiresAt,
  };

  // Save changes to file
  saveChanges();

  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  res.status(201).json({ 
    id, 
    shortUrl: `${baseUrl}/${id}`, 
    originalUrl,
    expiresAt 
  });
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = urlStore[id];
  
  if (!data || isUrlExpired(id)) {
    if (data) {
      delete urlStore[id];
      saveChanges();
    }
    res.status(404).json({ error: 'Short URL not found or expired' });
    return;
  }

  res.json({
    id,
    originalUrl: data.originalUrl,
    visits: data.visits,
    referers: data.referers,
    timestamps: data.timestamps,
    expiresAt: data.expiresAt,
  });
});

export default router;