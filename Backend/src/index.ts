import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import { urlStore, isUrlExpired } from "./routes/shorturls";
import { saveUrlStore } from "./utils/storage";
import { Log } from "../../MiddlewareLogger";

// import { Logger } from "middlewarelogger/dist"; // Imp orting the middleware logger

const app = express();

// Logging middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    await Log({
      stack: "backend",
      level: res.statusCode >= 400 ? "error" : "info",
      package: "middleware",
      message: `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    });
  });
  
  next();
});

app.use(cors());

app.use(express.json());

app.use("/", router);

app.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = urlStore[id];

  if (!data || isUrlExpired(id)) {
    if (data) {
      delete urlStore[id];
      saveUrlStore(urlStore);
      await Log({
        stack: "backend",
        level: "info",
        package: "route",
        message: `Expired URL removed during redirect: ${id}`
      });
    } else {
      await Log({
        stack: "backend",
        level: "warn",
        package: "route",
        message: `Invalid redirect attempt: ${id} not found`
      });
    }
    res.redirect("http://localhost:3000");
    return;
  }

  data.visits += 1;
  data.referers.push(req.get("referer") || "direct");
  data.timestamps.push(new Date().toISOString());
  saveUrlStore(urlStore);

  await Log({
    stack: "backend",
    level: "info",
    package: "route",
    message: `Successful redirect: ${id} -> ${data.originalUrl} (visits: ${data.visits})`
  });

  res.redirect(data.originalUrl);
});

// Optional: Cleanup job to remove expired URLs periodically
setInterval(async () => {
  let hasChanges = false;
  let expiredCount = 0;
  
  for (const [id, data] of Object.entries(urlStore)) {
    if (isUrlExpired(id)) {
      delete urlStore[id];
      hasChanges = true;
      expiredCount++;
    }
  }
  
  if (hasChanges) {
    saveUrlStore(urlStore);
    await Log({
      stack: "backend",
      level: "info",
      package: "cron_job",
      message: `Cleanup job completed: removed ${expiredCount} expired URLs`
    });
  }
}, 5 * 60 * 1000); // Run every 5 minutes

app.listen(5000, async () => {
  await Log({
    stack: "backend",
    level: "info",
    package: "service",
    message: "Server started on port 5000"
  });
});
