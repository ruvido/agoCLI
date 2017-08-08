#!/usr/bin/env node
const wed = require("./import-weddings.js")
const app = require('commander')

app
  .version('0.0.1')
  // .option('-l, --list [list]', 'list of customers in CSV file')
  .option('-i, --import [list]', 'list of weddings in simple format')
  .parse(process.argv)

if (app.import) {
  wed.import(app.import)
} else {
  console.log('default action')
}
