import requests
import openai
from bs4 import BeautifulSoup
import os

openai.api_key = os.environ["OPENAI_API_KEY"]


class AuthenticationError(Exception):
  pass


def get_lifelist_content():
  URL = "https://ebird.org/lifelist"
  response = requests.get(URL)
  for resp in response.history:
    if resp.status_code == 302:
      raise AuthenticationError()
  if response.status_code == 200:
    return response.text


def build_messages():
  try:
    lifelist_content = get_lifelist_content()
  except AuthenticationError:
    print("Log in to ebird.org and try again.")


messages = build_messages()
"""

prompt = "What rare birds have been sighted in my area in the past couple of years?  I live in Worcester, MA."

response = openai.ChatCompletion.create(model="gpt-4-turbo",
                                        messages=[{
                                            "role": "user",
                                            "content": prompt
                                        }],
                                        max_tokens=150)

reply = response['choices'][0]['message']['content'].strip()
print(reply)

    response = openai.Completion.create(
        model="gpt-4-turbo",
        messages=[{"role": "user", "content": text}],
        max_tokens=150
    )
    return response['choices'][0]['message']['content'].strip()

# Extracted content from the previous example
content = scan_web_page(url)
summary = summarize_text(content)
print(summary)
"""
