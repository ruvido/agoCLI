const path = require('path')
const config = {
  store:  'store',
  weddings: {
    store: '',
    folder: 'weddings'
  },
  hello: function () {
    console.log('hello')
  }
}

config.weddings.store = path.join(config.store, config.weddings.folder)

module.exports = config
