# -*- coding: utf-8 -*-
"""
Created on Thu Jun 10 11:01:51 2021

@author: ---
"""

import json
import pandas as pd
from datetime import datetime


def update_json_file():
    
    
    url_data = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv'
    url_look_up = 'countries_codes.csv'
    
    
    data_all = pd.read_csv(url_data, error_bad_lines=False).loc[: , ['iso_code','total_cases','total_deaths','total_vaccinations','people_vaccinated','people_fully_vaccinated']]
    data_look_up = pd.read_csv(url_look_up, error_bad_lines=False, keep_default_na=False, na_values=[""]).loc[: , ['iso2','iso3']].groupby(['iso3']).head(1)
    
    result = data_all.to_json(orient ='records')
    parsed = json.loads(result)
    
    # Add iso2 Code
    result_iso = dict(zip(data_look_up.iso3, data_look_up.iso2))
    
    for item in parsed:
        iso2_code = result_iso.get(item['iso_code'])
        if iso2_code:
            item['iso2'] = iso2_code
        else:
            parsed.remove(item)
            print("Item Removed:", item)
            
    output = {}
    output["fileDate"] = datetime.now().isoformat()
    output["places"] = parsed
    
    with open('covid_data.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=4)
    
    
    print('\n ---Data Fetch Complete---')
    



if __name__ == '__main__':
    update_json_file()
