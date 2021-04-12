import morgan from 'morgan'
import logger from './startup/logger.js'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import sanitizeMongo from 'express-mongo-sanitize'
import handleErrors from './middleware/handleErrors.js'
import logErrors from './middleware/logErrors.js'
import carsRouter from './routes/cars.js'
import peopleRouter from './routes/people.js'
import authRouter from './routes/auth/index.js'

import connectDatabase from './startup/connectDatabase.js'
connectDatabase()

const log = logger.child({ module: 'expressApp' })
const app = express()

log.info(`The running environment is: ${process.env.NODE_ENV}`)
log.warn(`The running environment is: ${app.get('env')}`) // if NODE_ENV is undefined, returns 'development'

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
)
app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))
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
