import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize} from './src/config/database.js'
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import decisionRoutes from "./src/routes/decision.routes.js";
import statsRoutes from "./src/routes/stats.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/decisions", decisionRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NovaPay API running" });
});


const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

export default app;
