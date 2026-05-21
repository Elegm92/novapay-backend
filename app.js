const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
// const { connectDB } = require('./src/config/database')
const authRoutes = require("./src/routes/auth.routes");
const transactionRoutes = require("./src/routes/transaction.routes");
const decisionsRoutes = require("./src/routes/decision.routes");
const statsRoutes = require("./src/routes/stats.routes");

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/decisions", decisionsRoutes);
app.use("/api/stats", statsRoutes);

// connectDB()

app.get('/', (req, res) => {
  res.json({ message: 'NovaPay API running' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app