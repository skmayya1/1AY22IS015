import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { loadUrlStore, saveUrlStore } from '../utils/storage';
import { Log } from '../../../MiddlewareLogger';

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

router.post('/', async (req: Request, res: Response) => {
  const { originalUrl, expiryMinutes } = req.body;
  if (!originalUrl) {
    await Log({
      stack: "backend",
      level: "error",
      package: "route",
      message: "URL shortening failed: originalUrl is missing"
    });
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
    expiresAt: expiresAt.toISOString(),
  };

  // Save changes to file
  saveChanges();

  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const shortUrl = `${baseUrl}/${id}`;
  
  await Log({
    stack: "backend",
    level: "info",
    package: "route",
    message: `URL shortened successfully: ${originalUrl} -> ${shortUrl}`
  });

  res.status(201).json({ 
    id, 
    shortUrl, 
    originalUrl,
    expiresAt 
  });
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = urlStore[id];
  
  if (!data || isUrlExpired(id)) {
    if (data) {
      delete urlStore[id];
      saveChanges();
      await Log({
        stack: "backend",
        level: "info",
        package: "route",
        message: `Expired URL removed: ${id}`
      });
    } else {
      await Log({
        stack: "backend",
        level: "warn",
        package: "route",
        message: `URL not found: ${id}`
      });
    }
    res.status(404).json({ error: 'Short URL not found or expired' });
    return;
  }

  await Log({
    stack: "backend",
    level: "info",
    package: "route",
    message: `URL details retrieved: ${id} (visits: ${data.visits})`
  });

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