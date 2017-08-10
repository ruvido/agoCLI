const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
const config = require("./config.js")


module.exports = {
  newObjFromId: function (id) {
    let year = path.basename(id, config.dbExtension).split('-')[0]
    let groom = path.basename(id, config.dbExtension).split('-')[3]
    let bride = path.basename(id, config.dbExtension).split('-')[5]
    let date = path.basename(id, config.dbExtension).slice(0,10)
    console.log(date);
    obj = config.weddings.defaults
    obj.date = date
    obj.groom = groom
    obj.bride = bride
    return obj
  },
  objFromFilename: function (id) {
    if (path.extname(id) === config.dbExtension) {
      id = path.basename(id, config.dbExtension)
    }
    let year = path.basename(id, config.dbExtension).split('-')[0]
    let completeFolder = path.join(config.weddings.store, year)
    let completeFileName = path.join(completeFolder, id+config.dbExtension)
    var obj = yaml.safeLoad(fs.readFileSync(completeFileName, 'utf8'))
    return obj
  },
  objToId: function (obj) {
    let id = obj.date+'-'+obj.groom+'-e-'+obj.bride
    return id
  },
  arrayStat: function (arr) {
    var total = 0
    if (arr !== undefined ) {
      arr.forEach(ele => {
        console.log(ele[0]+'\t'+ele[1])
        total += ele[0]
      })
      console.log(total+'\t'+'TOTALE')
      console.log('')
    }
    return total
  }
}
