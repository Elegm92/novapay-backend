import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
//import { connectDB } from './src/config/database.js'
import authRoutes from './src/routes/auth.routes.js'
import transactionRoutes from './src/routes/transaction.routes.js'
import decisionRoutes from './src/routes/decision.routes.js'
import statsRoutes from './src/routes/stats.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/decisions", decisionRoutes);
app.use("/api/stats", statsRoutes);

// connectDB()

app.get('/', (req, res) => {
  res.json({ message: 'NovaPay API running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app;