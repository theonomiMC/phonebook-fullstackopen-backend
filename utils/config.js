require('dotenv').config()

let { MONGODB_URI, PORT } = process.env

module.exports = {
  MONGODB_URI,
  PORT
}
