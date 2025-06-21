import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";

import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

// Load environment variables
config({ path: "./config.env" });

const app = express();

// ✅ CORS Setup for local frontend access (adjust ports as needed)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Common Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ✅ API Routes Only
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// ✅ Unknown API Route Handler
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// ✅ Error Middleware
app.use(errorMiddleware);

// ✅ Connect to DB
dbConnection();

export default app;
