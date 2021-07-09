const countriesFilename = './countries.json'
const responsesPublicFilename = './responses-public.json'
const responseRoundsFilename = './response-rounds.json'
const outputFilename = "../global.v2.json"
const outputMinifiedFilename = "../global.v2.min.json"
const outputCsvFilename = "../global.v2.csv"


// load the data from files
const countries = require(countriesFilename)
const responsesPublic = require(responsesPublicFilename)
const responseRounds = require(responseRoundsFilename)


// add roundId (via lookup) and type to each responsePublic
for (responsePublic of responsesPublic) {
  responsePublic.roundId = responseRounds.find(responseRound => responseRound.startDate <= responsePublic.responseDate && responsePublic.responseDate <= responseRound.endDate)?.roundNumber
  responsePublic.type = 'observed'
}

// load responsesPublic into a Map using each record's .__id as the key
const responsesPublicMap = new Map(responsesPublic.map(responsePublic => [responsePublic.__id, responsePublic]))

// swap out the responsesPublic record identifiers for the real records in each country record
countries
  .sort((country1, country2) => {
    return country1.countryName?.localeCompare(country2.countryName)
  })
  .forEach((country) => {
    country.responsesPublic = country.responsesPublic
      ?.map(responsePublicId => responsesPublicMap.get(responsePublicId))
      .sort((responsePublic1, responsePublic2) => {
        return responsePublic1.roundId - responsePublic2.roundId
      })
  })

const output = {
  countries: countries,
  responseRounds: responseRounds
}

// write the result to file, both readable and minified
const fs = require('fs')
try {
  fs.writeFileSync(outputFilename, JSON.stringify(output, null, 2), 'utf8')
  console.log(`${output.responseRounds.length} responseRound and ${output.countries.length} country records written to '${outputFilename}'`)
} catch (err) {
  console.error(`error writing '${outputFilename}'`, err)
}
try {
  fs.writeFileSync(outputMinifiedFilename, JSON.stringify(output), 'utf8')
  console.log(`${output.responseRounds.length} responseRound and ${output.countries.length} country records written to '${outputMinifiedFilename}'`)
} catch (err) {
  console.error(`error writing '${outputFilename}'`, err)
}

for (country of countries) {
  delete country.owidHasVaccine
  delete country.__id
  if (country.responsesPublic) {
    for (response of country.responsesPublic) {
      delete response.type
    }
  }
}

const responsesForCsv = countries
  .flatMap((country) => {
    return (country.responsesPublic || []).map((response) => {
      return {...country, ...response}
    })
  }).map((responseRecord) => {
    delete responseRecord.responsesPublic
    delete responseRecord.owidHasVaccine
    return responseRecord
  })

const csvHeaders = [
  "__id",
  "countryName",
  "iso3166Alpha2Code",
  "iso3166Alpha3Code",
  "m49code",
  "wbCountryCode",
  "wbIncomeLevelCode",
  "wbIncomeLevelName",
  "wbLendingTypeCode",
  "wbLendingTypeName",
  "wbRegion",
  "wbRegionCode",
  "responseDate",
  "roundId",
  "extendedBreakCode",
  "educationStatusCode",
  "educationStatusPrePrimaryCode",
  "educationStatusPrimaryCode",
  "educationStatusLowerSecondaryCode",
  "educationStatusUpperSecondaryCode",
  "educationStatusHigherCode",
  "educationStatusVocationalCode",
  "vaccineAvailabilityForTeachersCode",
  "inPersonAdditionalSupportPrePrimary",
  "inPersonAdditionalSupportPrimary",
  "inPersonAdditionalSupportLowerSecondary",
  "inPersonAdditionalSupportUpperSecondary",
  "remoteEducationModalitiesPrePrimaryCode",
  "remoteEducationModalitiesPrimaryCode",
  "remoteEducationModalitiesLowerSecondaryCode",
  "remoteEducationModalitiesUpperSecondaryCode",
  "remoteEducationModalitiesHigherCode",
  "remoteEducationModalitiesVocationalCode"
]

const fastCsv = require('@fast-csv/format')
fastCsv.writeToPath(outputCsvFilename, responsesForCsv, {headers: csvHeaders})
  .on('error', err => {
    console.error(`error writing '${outputCsvFilename}'`, err)
  })
  .on('finish', () => {
    console.log(`${responsesForCsv.length} records written to '${outputCsvFilename}'`)
  })
