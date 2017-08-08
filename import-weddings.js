const path = require('path')
const config = require("./config.js")
const csv = require('csv')
const yaml = require('js-yaml')
const fs = require('fs')

module.exports = {
  import: function (weddingList) {
    let stream = fs.createReadStream(weddingList)
    .pipe(csv.parse({ delimiter : ' ' }))
    .on('data', function (data) {
      let year = data[0].slice(0,4)
      let month = data[0].slice(4,6)
      let day = data[0].slice(6,8)
      let eventDate = year+'-'+month+'-'+day
      let groom = data.slice(1).join(" ").split(" e ")[0].trim()
      let bride = data.slice(1).join(" ").split(" e ")[1].trim()
      let yml = yaml.dump({
        date: eventDate,
        groom: groom,
        bride: bride
      })
      let filename = eventDate+'-'+groom+'-e-'+bride
      fs.writeFile(path.join(config.weddings.store, filename),
      '---\n'+yml+'---\n', (err) => {
        if (err) throw err
        console.log(filename+' saved!')
      })
    })
  }
}
