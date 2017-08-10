#!/usr/bin/env node
const wed = require("./weddings.js")
const app = require('commander')

app
  .version('0.0.1')
  // .option('-l, --list [list]', 'list of customers in CSV file')
  .option('-i, --import [list]', 'import weddings from file')
  .option('-w, --weddings [year]', 'list of weddings in simple format')
  .option('-e, --edit [weddingID]', 'edit wedding details')
  .option('-d, --delete [weddingID]', 'delete wedding event')
  .option('-s, --status [status]', 'list weddings by status [rating, color, review, book, print, devlivery, done]')
  .parse(process.argv)

if (app.import) {
  wed.import(app.import)
} else if (app.weddings) {
  wed.show(app.weddings)
} else if (app.edit) {
  wed.edit(app.edit)
} else if (app.delete) {
  wed.delete(app.delete)
} else if (app.status) {
  if (app.status === 'undefined') {
    app.status = ''
  }
  wed.status(app.status)
} else {
  if (process.argv.length > 2) {
    wed.stat(process.argv[2])
  } else {
    let thisYear = '2017'
    wed.show(thisYear)
  }
}
