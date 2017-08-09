#!/usr/bin/env node
const wed = require("./weddings.js")
const app = require('commander')

app
  .version('0.0.1')
  // .option('-l, --list [list]', 'list of customers in CSV file')
  .option('-i, --import [list]', 'import weddings from file')
  .option('-w, --weddings [year]', 'list of weddings in simple format')
  .option('-e, --edit [weddingID]', 'edit wedding details')
  .parse(process.argv)

if (app.import) {
  wed.import(app.import)
} else if (app.weddings) {
  wed.show(app.weddings)
} else if (app.edit) {
  wed.edit(app.edit)
} else {
  console.log('default action')
}
