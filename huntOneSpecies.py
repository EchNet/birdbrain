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
        "back": 4,  # days
        "detail": "simple"
    })

count = 0
for sighting in sightings:
  if "roseate" in sighting["comName"].lower():
    count += 1
    print(sighting["comName"])
    print(sighting["howMany"])
    print(sighting["locName"])
    print(sighting["obsDt"])
    print("-------")
print("TOTAL", count)
