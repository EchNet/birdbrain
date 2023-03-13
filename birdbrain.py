import requests
import json

# Set the API endpoint
endpoint = 'https://api.ebird.org/v2/data/obs/geo/recent'

# Set the API key and authentication headers
api_key = 'your_api_key_here'
headers = {'X-eBirdApiToken': api_key}

# Set the geographic location and radius
lat = 40.7128
lng = -74.0060
radius = 10  # miles

# Set the parameters for the API request
params = {
    'lat': lat,
    'lng': lng,
    'dist': radius,
    'maxResults': 100,
    'back': 30,
    'detail': 'simple'
}

# Make the API request
response = requests.get(endpoint, headers=headers, params=params)

# Parse the response JSON
data = json.loads(response.text)

# Get the user's life list
life_list = set()

# Make another API request to get the user's life list
life_list_endpoint = 'https://api.ebird.org/v2/user/life/list'
life_list_params = {'maxResults': 200}

life_list_response = requests.get(life_list_endpoint,
                                  headers=headers,
                                  params=life_list_params)
life_list_data = json.loads(life_list_response.text)

# Add the birds in the user's life list to the set
for bird in life_list_data:
    life_list.add(bird['speciesCode'])

# Print out the recent sightings that are not on the user's life list
for sighting in data:
    if sighting['speciesCode'] not in life_list:
        print(sighting['comName'])
