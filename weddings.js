const path = require('path')
const config = require("./config.js")
const agoYaml = require("./agoYaml.js")
const csv = require('csv')
const yaml = require('js-yaml')
const fs = require('fs')
const mkdirp = require('mkdirp')

// function objToFileName (obj) {
//   let fileName = obj.date+'-'+obj.groom+'-e-'+obj.bride
//   return fileName
// }

// function fileNameToObjDefault(fileName) {
function fileNameToObj(fileName) {
  let objValues = path.basename(fileName, config.dbExtension).split('-')
  let year = objValues[0]
  let month = objValues[1]
  let day = objValues[2]
  obj = {
    date: year+'-'+month+'-'+day,
    groom: objValues[3],
    bride: objValues[5]
  }
  return obj
}

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
      // let fileName = eventDate+'-'+groom+'-e-'+bride+'.yml'
      let folderName = path.join(config.weddings.store, year)
      if (!fs.existsSync(folderName)){
        // fs.mkdirSync(folderName)
        mkdirp.sync(folderName)
      }
      obj = config.weddings.defaults
      obj.date = eventDate
      obj.groom = groom
      obj.bride = bride
      let yml = yaml.dump(obj)
      // let completeFileName = path.join(folderName, objToFileName(obj)+config.dbExtension)
      let completeFileName = path.join(folderName, agoYaml.objToId(obj)+config.dbExtension)
      if (!fs.existsSync(completeFileName)){
        fs.writeFile(completeFileName, yml, (err) => {
        // '---\n'+yml+'---\n', (err) => {
          if (err) throw err
          console.log(completeFileName+' saved!')
        })
      } else {
        console.log(completeFileName+' already exist!')
      }
    })
  },

  show: function (year) {
    fs.readdir(path.join(config.weddings.store, year), (err, files) => {
      if (err) {
        console.log('No weddings for this year')
      } else {
        files.forEach(file => {
          console.log(path.basename(file, config.dbExtension))
        })
      }
    })
  },

  edit: function (id) {
    let year = id.split('-')[0]
    let completeFolder = path.join(config.weddings.store, year)
    let completeFileName = path.join(completeFolder, id+config.dbExtension)
    let editor = process.env.EDITOR || 'nano'
    const { spawn } = require('child_process')
    if (!fs.existsSync(completeFolder)){
      mkdirp.sync(completeFolder)
    }
    if (!fs.existsSync(completeFileName)){
      let obj = agoYaml.newObjFromId(completeFileName)
      let yml = yaml.safeDump(obj)
      fs.writeFileSync(completeFileName, yml)
    }
    var child = spawn(editor, [completeFileName], {
      stdio: 'inherit'
    })
    child.on('exit', function (e, code) {
      try {
        var obj = yaml.safeLoad(fs.readFileSync(completeFileName, 'utf8'))
        // correctId = objToFileName(obj)
        correctId = agoYaml.objToId(obj)
        if ( correctId === id ) {
          console.log(completeFileName+' updated')
        } else {
          let correctFolder = path.join(config.weddings.store, obj.date.split('-')[0])
          if (!fs.existsSync(correctFolder)){
            mkdirp.sync(correctFolder, function (err) {
              if (err) console.error(err)
            })
          }
          let correctFileName = path.join(correctFolder, correctId+config.dbExtension)
          fs.rename(completeFileName, correctFileName, function(err) {
            if ( err ) {
              console.log('ERROR: rename')
              console.log(correctId)
              console.log(err)
            } else {
              console.log(correctFileName+' new name')
            }
          })
        }
      } catch (e) {
          console.log(e)
      }
    })
  },
  delete: function (id) {
    console.log('MISSING')
    console.log(id+' deleted')
  },
  status: function (status) {
    console.log(status);
    fs.readdir(path.join(config.weddings.store), (err, years) => {
      if (err) {
        console.log('No weddings for this year')
      } else {
        years.forEach(year => {
          fs.readdir(path.join(config.weddings.store, year), (err, events) => {
            if (err) console.log(err)
            else {
              // console.log(events)
              events.forEach(id => {
                let obj = agoYaml.objFromFilename(id)
                if (obj.status === status) {
                  console.log(agoYaml.objToId(obj))
                } else if (obj.status === undefined && status === '') {
                  console.log(agoYaml.objToId(obj))
                }
              })
            }
          })
          // console.log(path.basename(file, config.dbExtension))
        })
      }
    })

  },
  stat: function (id) {
    let obj = agoYaml.objFromFilename(id)
    console.log('')
    totalPackages = agoYaml.arrayStat(obj.packages)
    totalPay      = agoYaml.arrayStat(obj.payments)
    console.log(totalPackages-totalPay+'\t'+'DIFFERENZA')
    console.log('')
  }
}
