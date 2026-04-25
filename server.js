import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import importUserRoutes from "./routes/importUserRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();

// 🔥 Fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 CSP (optional but cleaner)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src * data: blob: 'unsafe-inline' 'unsafe-eval';"
  );
  next();
});

// ✅ CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://watai.store",
      "https://www.watai.store",
      "https://newadmin.watai.store", // 🔥 ADD THIS
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/import-users", importUserRoutes);

// ✅ STATIC SERVE (production)
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "Client", "dist");

  app.use(express.static(clientPath));

  // 🔥 THIS IS THE ONLY SAFE WAY
  app.use((req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

// ✅ PORT
const port = process.env.PORT || 5010;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});