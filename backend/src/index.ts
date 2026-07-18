import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import messagesRouter from "./routes/messages";
import debtsRouter from "./routes/debts";
import pricesRouter from "./routes/prices";
import summaryRouter from "./routes/summary";

const app = express();
const PORT = process.env.PORT ?? 4000;

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/debts", debtsRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/summary", summaryRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Sales Voice backend running on http://localhost:${PORT}`);
});