import requests


def get_species_name(species_code):
  """Fetches the common and scientific name of a bird species from eBird using its species code."""
  url = f"https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json"
  headers = {"X-eBirdApiToken": "YOUR_EBIRD_API_KEY"}  # Replace with your eBird API key

  response = requests.get(url, headers=headers)
  if response.status_code != 200:
    return None

  data = response.json()
  for bird in data:
    if bird.get("speciesCode") == species_code:
      return bird.get("comName"), bird.get("sciName")
  return None


def get_wikimedia_image(bird_name):
  """Fetches an image URL from Wikimedia Commons based on the bird's name."""
  url = "https://en.wikipedia.org/w/api.php"
  params = {
      "action": "query",
      "format": "json",
      "prop": "pageimages",
      "titles": bird_name,
      "piprop": "original"
  }

  response = requests.get(url, params=params)
  if response.status_code != 200:
    return None

  data = response.json()
  pages = data.get("query", {}).get("pages", {})

  for _, page in pages.items():
    if "original" in page:
      return page["original"]["source"]

  return None


def fetch_bird_image(species_code):
  species_name = get_species_name(species_code)
  if not species_name:
    print("Species code not found.")
    return

  common_name, sci_name = species_name
  image_url = get_wikimedia_image(common_name) or get_wikimedia_image(sci_name)

  if image_url:
    print(f"Image for {common_name} ({sci_name}): {image_url}")
  else:
    print(f"No image found for {common_name}.")


# Example usage
fetch_bird_image("turame")  # Example: American Robin
