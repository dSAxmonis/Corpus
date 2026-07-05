import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import itemRoutes from './routes/items.js'
import uploadRoutes from './routes/upload.js'
import spaceRoutes from './routes/spaces.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'https://corpus-kappa-one.vercel.app',
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'corpus-server' })
})

app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/spaces', spaceRoutes)

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`)
  })
}

start()
