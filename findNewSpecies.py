import csv
import requests
import json
import sys

# Set the API key and authentication headers
api_key = '9kpvnnu8m60i'
headers = {'X-eBirdApiToken': api_key}


def load_life_list():
    # Get the user's life list.

    life_list_endpoint = 'https://api.ebird.org/v2/user/life/list'
    life_list_params = {'maxResults': 1500}

    # This is not even a real API method!  Cmon ChatGPT!
    #life_list_response = requests.get(life_list_endpoint,
    #headers=headers,
    #params=life_list_params)
    #life_list_response.raise_for_status()
    #life_list_data = json.loads(life_list_response.text)
    #life_list_data = []
    #life_list = {bird['speciesCode'] for bird in life_list_data}

    life_list = set()
    with open("MyEBirdData.csv", newline="") as csvfile:
        csv_reader = csv.reader(csvfile)
        for row_index, row in enumerate(csv_reader):
            if row_index == 0: continue
            life_list.add(row[1].lower())

    print(f"Life list count: {len(life_list)}")
    return life_list


def load_species_sighted(
        # Set the geographic location and radius
        lat=42.41529248250517,
        lng=-71.77249755411249,
        radius=18,  # miles
):

    # API request to get recent sightings.
    endpoint = 'https://api.ebird.org/v2/data/obs/geo/recent'

    # Set the parameters for the API request
    params = {
        'lat': lat,
        'lng': lng,
        'dist': radius,
        'maxResults': 100,
        'back': 7,  # days
        'detail': 'simple'
    }

    # Make the API request
    response = requests.get(endpoint, headers=headers, params=params)
    response.raise_for_status()

    # Parse the response JSON
    data = json.loads(response.text)
    print(f"Recent sightings: {len(data)}")
    return data


try:
    sightings = load_species_sighted()
    life_list = load_life_list()
except Exception as e:
    print(e)
    sys.exit(1)

# Print out the recent sightings that are not on the user's life list
count = 0
for sighting in sightings:
    if sighting['comName'].lower() not in life_list:
        if count == 0:
            print()
        ++count
        print(sighting["comName"])
        print(sighting["obsDt"])
        print(sighting["locName"])
