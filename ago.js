#!/usr/bin/env node
const config = require("./config.js")
const csv = require('csv')
const yaml = require('js-yaml')
const app = require('commander')
const fs = require('fs')

app
  .version('0.0.1')
  // .option('-l, --list [list]', 'list of customers in CSV file')
  .option('-i, --import [list]', 'list of weddings in simple format')
  .parse(process.argv)

let stream = fs.createReadStream(app.import)
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
  fs.writeFile('./store/weddings/'+filename,
  '---\n'+yml+'---\n', (err) => {
    if (err) throw err
    console.log(filename+' saved!')
  })
})
