# scripts

- `download-airtable-data.js [config_file]`: downloads data from airtable based upon the config file passed in the first parameter. To run this you must have `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` in your environment variables (or `.env` file); you must also require `esm` when calling the script. For example: `node -r esm -r dotenv/config download-airtable-data.js ./download-airtable-data-config.json`. Each table described in the configuration file is downloaded as a separate file.

- `process-airtable-data.js`: generates `global.v2.json` and `global.v2.min.json` based upon data from `countries`, `responseRounds`, and `responsesPublic` obtained from airtable.

## setting up your environment

- NodeJS 14 or higher recommended
- run `npm install` to install dependencies before running the above scripts