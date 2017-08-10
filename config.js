const path = require('path')
const config = {
  dbExtension: '.yml',
  store:  'store',
  weddings: {
    store: '',
    folder: 'weddings',
    defaults: {
      date: '',
      groom: '',
      bride: '',
      status: '',
      staff: [],
      packages: [],
      payments: []
    }
  },
  hello: function () {
    console.log('hello')
  }
}

config.weddings.store = path.join(config.store, config.weddings.folder)

module.exports = config
