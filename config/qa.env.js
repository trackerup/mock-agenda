'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://qa-api-admin.trackerup.com.br/"',
  VERSION: prodEnv.VERSION + ' + "qa"'
})
