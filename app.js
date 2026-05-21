const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { connectDB } = require('./src/config/database')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get('/', (req, res) => {
  res.json({ message: 'NovaPay API running' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app