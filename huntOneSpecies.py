from apiConnector import ApiConnector

# Set the API key.
api = ApiConnector({"apiKey": "9kpvnnu8m60i"})

# API request to get recent sightings.
sightings = api.get(
    "data/obs/geo/recent",
    {
        "lat": 29.538056,
        "lng": -81.223333,
        "dist": 22,
        "maxResults": 5000,
        "back": 7,  # days
        "detail": "simple"
    })

species = {}
for sighting in sightings:
  species[sighting['comName'].lower()] = sighting

for sighting in species.values():
  print(sighting["comName"], sighting["obsDt"], sighting["locName"])
