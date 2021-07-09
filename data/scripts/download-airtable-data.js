if (!(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID)) {
  console.error(`missing required environment variable AIRTABLE_API_KEY or AIRTABLE_BASE_ID`)
  process.exit(1)
}

// get command-line arguments after 'node filename'
const myArgs = process.argv.slice(2)

if (myArgs.length === 0) {
  console.error('missing required command-line argument with configuration filename')
  process.exit
}

// load the configuration from filename provided at the command line
let configuration
try {
  configuration = require(myArgs[0])
} catch (err) {
  console.error(`error reading configuration file ${myArgs[0]}! cannot proceed`, err)
  process.exit(1)
}

// these statements require esm, so best to launch this script with 'node -r esm'
import airtableJson from 'airtable-json'
import fs from 'fs'

// function call download data from airtable
const getCountries = async(configurationItem) => {
  const results = await airtableJson({
    auth_key: process.env.AIRTABLE_API_KEY,
    base_name: process.env.AIRTABLE_BASE_ID,
    primary: configurationItem.table,
    view: configurationItem.view,
    populate: configurationItem.populate
  })
  return { ...configurationItem, results: results }
}

// function call to save a data file once it has been downloaded
const saveFile = (configurationItem) => {
  if (configurationItem.keepFields) {
    configurationItem.results = configurationItem.results.map((dataItem) => {
      Object.getOwnPropertyNames(dataItem).forEach((name) => {
        if (!configurationItem.keepFields.includes(name)) { delete dataItem[name]}
      })
      return dataItem
    })
  }
  fs.writeFile(configurationItem.filename, JSON.stringify(configurationItem.results, null, 2), 'utf8', (err)=> {
    if (err) {
      console.error(`error writing file '${configurationItem.filename}': ${err}`); process.exitCode = 1; return 1
    } else {
      console.log(`${configurationItem.results.length} records written to '${configurationItem.filename}'`)
    }
  })
}

// chain the configuration items so they are downloaded and saved in series (not parallel)
const starterPromise = Promise.resolve(null)
configuration.reduce((p, configurationItem) =>
  p.then(() => getCountries(configurationItem)
    .then(configurationItem => saveFile(configurationItem))
    .catch(err => console.error(configurationItem, err))
  ), starterPromise)
