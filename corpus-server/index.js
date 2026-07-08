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
const PORT = process.env.PORT || 5001

app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        'http://localhost:5173',
        'https://corpus-kappa-one.vercel.app',
      ]
      // allow requests with no origin (extensions, curl, mobile apps)
      if (!origin || allowed.includes(origin) || origin.startsWith('chrome-extension://')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
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
