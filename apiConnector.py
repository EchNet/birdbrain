import requests
import json

DEFAULT_PROTOCOL = "https"
DEFAULT_HOST = "api.ebird.org"
DEFAULT_VERSION = "v2"


class ApiConnector:
  def __init__(self, options={}):
    options = options.copy()

    self.apiKey = options.pop("apiKey", None)
    if self.apiKey is None:
      raise KeyError("no apiKey provided")

    self.protocol = options.pop("protocol", DEFAULT_PROTOCOL)
    if self.protocol not in ["http", "https"]:
      raise ValueError("invalid protocol")

    self.host = options.pop("host", DEFAULT_HOST)
    self.version = options.pop("version", DEFAULT_VERSION)

    if len(options) > 0:
      raise ValueError(f"unrecognized options: {options.keys()}")

  def _make_headers(self):
    return {"X-eBirdApiToken": self.apiKey}

  def get(self, path="/", params={}):
    full_path = f"{self.version}/{path}"
    full_path = "/".join([comp for comp in full_path.split("/") if bool(comp)])
    url = f"{self.protocol}://{self.host}/{full_path}"

    headers = self._make_headers()

    # Make the API request
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()

    # Parse the response JSON
    data = json.loads(response.text)
    return data
