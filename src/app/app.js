import express from "express";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import router from "../routes/index.js";
import errorHandler from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import { connectDB } from "../config/database.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

app.use(compression());

// Logger
const stream = logger?.stream || { write: (message) => console.log(message) };
app.use(morgan("dev", { stream }));

// Routes
app.use("/api/v1", router);

// Error Handling Middleware
app.use(errorHandler);

export default app;
