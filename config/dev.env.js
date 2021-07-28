'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: process.env.CORDOVA_API_URL ? process.env.CORDOVA_API_URL : '"https://dev.api.multimarcas.local/"',
  // DATABASE_NAME: '"DEV_trackerup"',
  // BASE_URL: '"/"',
  VERSION: prodEnv.VERSION + ' + "qa"'
})
