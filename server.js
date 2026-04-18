import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import importUserRoutes from "./routes/importUserRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dns from "dns";
dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/import-users", importUserRoutes);

const port = process.env.PORT || 5010;

app.listen(port, () => console.log("Server running..."));