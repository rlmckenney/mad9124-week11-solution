import mongoose from 'mongoose'
import config from 'config'
import logger from './logger.js'

const log = logger.child({ module: 'connectDB' })
const dbConf = config.get('db')
const jwt = config.get('jwt')

log.info(`jwt key: ${jwt.secretKey}`)

export default function () {
  mongoose
    .connect(`mongodb://${dbConf.host}:${dbConf.port}/${dbConf.dbName}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      log.info('Successfully connected to MongoDB ...')
    })
    .catch((err) => {
      log.error('Error connecting to MongoDB ... ', err.message)
      process.exit(1)
    })
}
