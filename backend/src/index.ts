import express, { Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import path from 'path'
import 'dotenv/config'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log('Connected to Database Successfully')
  })
  .catch((error) => {
    console.log('Database Connection Error: ' + error)
  })

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
