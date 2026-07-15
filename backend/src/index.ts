import "dotenv/config";
import express from "express";
import cors from "cors";
import messagesRouter from "./routes/messages";
import debtsRouter from "./routes/debts";
import pricesRouter from "./routes/prices";
import summaryRouter from "./routes/summary";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/messages", messagesRouter);
app.use("/api/debts", debtsRouter);
app.use("/api/prices", pricesRouter);
app.use("/api/summary", summaryRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Sales Voice backend running on http://localhost:${PORT}`);
});
