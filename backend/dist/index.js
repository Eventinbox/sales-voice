"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const messages_1 = __importDefault(require("./routes/messages"));
const debts_1 = __importDefault(require("./routes/debts"));
const prices_1 = __importDefault(require("./routes/prices"));
const summary_1 = __importDefault(require("./routes/summary"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 4000;
app.use((0, cors_1.default)({ origin: "http://localhost:3000" }));
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/messages", messages_1.default);
app.use("/api/debts", debts_1.default);
app.use("/api/prices", prices_1.default);
app.use("/api/summary", summary_1.default);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.listen(PORT, () => {
    console.log(`Sales Voice backend running on http://localhost:${PORT}`);
});
