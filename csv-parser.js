const csv = require('csv')

let parse = csv.parse
let stream = fs.createReadStream(app.import)
    .pipe(parse({ delimiter : ',' }))

stream
  .on('data', function (data) {
    let date  = data[0].trim()
    let groom = data[1].trim()
    let bride = data[2].trim()
    console.log(date, groom +" e "+bride)
  })
