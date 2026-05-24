import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB, sequelize} from './src/config/database.js'
import seedAnalyst from './src/seeders/analyst.seeder.js'
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";
import decisionRoutes from "./src/routes/decision.routes.js";
import statsRoutes from "./src/routes/stats.routes.js";
import clientRoutes from "./src/routes/client.routes.js";
import fraudRoutes from "./src/routes/fraud.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts, please try again in 15 minutes' }
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/decisions", decisionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/fraud", fraudRoutes);

app.get("/", (req, res) => {
  res.json({ message: "NovaPay API running" });
});


const start = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  await seedAnalyst();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

export default app;
