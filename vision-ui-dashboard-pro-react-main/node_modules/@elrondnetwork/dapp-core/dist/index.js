
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dapp-core.cjs.production.min.js')
} else {
  module.exports = require('./dapp-core.cjs.development.js')
}
