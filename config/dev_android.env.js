'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"',
  API_URL: '"https://192.168.1.106/multimarcas-trackerup/trackerup-api/"',
  // API_URL: '"https://qa-api-admin.trackerup.com.br/"',
  // API_URL: '"https://dev-api.multimarcas.trackerup.com.br"',
  VERSION: prodEnv.VERSION + ' + "qa"'
})
