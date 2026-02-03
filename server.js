import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

//db connection
connectDb()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on :${process.env.PORT}`);
});
