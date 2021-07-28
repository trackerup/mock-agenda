'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL:'"https://whirlpool.trackerup.com.br/api/"',
  DATABASE_NAME:'"trackerup"',
  BASE_URL: '"/"',
  ONESIGNAL_TOKEN: '"05f460f0-3532-4e70-9bd4-97bc8cbd5cb2"'
})
