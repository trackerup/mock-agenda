
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const xml2js = require('xml2js')
const parseString = require('xml2js').parseString

module.exports = function () {
  console.log('process.env', process.env)

  let version = process.env.VERSION
  const versionCode = version.replace(/[^0-9.]*/g, '')
  version = versionCode.split('.')

  const androidVersionCode = version[0].padStart(3, '0') + version[1].padStart(5, '0') + version[2].padStart(4, '0')
  process.env.xmlFiles = {
    androidVersionCode: androidVersionCode,
    version: versionCode,
    name: process.env.APP_NAME.replace(/"+/g, ''),
    packageName: process.env.APP_PACKAGE
  }
  fs.readFile(path.join(__dirname, '../config/cordovaConfig.xml'), 'utf-8', function (err, data) {
    if (err) {
      console.log(chalk.red(err))
      process.exit(1)
    }
    // we then pass the data to our method here
    parseString(data, function (err, result) {
      if (err) {
        console.log(chalk.red(err))
        process.exit(1)
      }

      var json = result
      json.widget.$['id'] = process.env.xmlFiles.packageName
      json.widget.$['version'] = process.env.xmlFiles.version
      json.widget.$['android-versionCode'] = process.env.xmlFiles.androidVersionCode
      json.widget.name[0] = process.env.xmlFiles.name
      json.widget.platform[2]['config-file'][0]['meta-data'][0].$['android:value'] = process.env.GEO_KEY

      // create a new builder object and then convert
      // our json back to xml.
      var builder = new xml2js.Builder()
      var xml = builder.buildObject(json)

      fs.writeFile('config.xml', xml, function (err, data) {
        if (err) {
          console.log(chalk.red(err))
          process.exit(1)
        }
        console.log(chalk.cyan('successfully written our update xml to file.\n'))
      })
    })
  })
}
