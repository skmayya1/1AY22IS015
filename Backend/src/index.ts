import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import { urlStore, isUrlExpired } from "./routes/shorturls";
import { saveUrlStore } from "./utils/storage";
import { Log } from "middlewarelogger";

// import { Logger } from "middlewarelogger/dist"; // Importing the middleware logger

const app = express();

// Logging middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    await Log({
      stack: "backend",
      level: res.statusCode >= 400 ? "error" : "info",
      package: "route",
      message: `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    });
  });
  
  next();
});

app.use(cors());

app.use(express.json());

app.use("/", router);

app.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const data = urlStore[id];

  if (!data || isUrlExpired(id)) {
    if (data) {
      // Clean up expired URL
      delete urlStore[id];
      saveUrlStore(urlStore);
    }
    res.redirect("http://localhost:3000");
    return;
  }

  data.visits += 1;
  data.referers.push(req.get("referer") || "direct");
  data.timestamps.push(new Date().toISOString());
  saveUrlStore(urlStore);
  res.redirect(data.originalUrl);
});

// Optional: Cleanup job to remove expired URLs periodically
setInterval(() => {
  let hasChanges = false;
  for (const [id, data] of Object.entries(urlStore)) {
    if (isUrlExpired(id)) {
      delete urlStore[id];
      hasChanges = true;
    }
  }
  if (hasChanges) {
    saveUrlStore(urlStore);
  }
}, 5 * 60 * 1000); // Run every 5 minutes

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
