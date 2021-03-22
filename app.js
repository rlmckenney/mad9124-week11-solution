import morgan from 'morgan'
import express from 'express'
import cors from 'cors'
import sanitizeMongo from 'express-mongo-sanitize'
import handleErrors from './middleware/handleErrors.js'
import logErrors from './middleware/logErrors.js'
import carsRouter from './routes/cars.js'
import peopleRouter from './routes/people.js'
import authRouter from './routes/auth/index.js'

import connectDatabase from './startup/connectDatabase.js'
connectDatabase()

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(sanitizeMongo())

// routes
app.use('/auth', authRouter)
app.use('/api/cars', carsRouter)
app.use('/api/people', peopleRouter)

// error handlers
app.use(logErrors)
app.use(handleErrors)

export default app
