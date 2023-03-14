import openai
import os

# Load the API key from the file
with open("openai_api_key.txt", "r") as f:
    api_key = f.read().strip()

# Configure the OpenAI API client
openai.api_key = api_key

# Make a request to the OpenAI API
response = openai.Completion.create(
    engine="davinci",
    prompt="Hello,",
    max_tokens=5
)

# Print the API response
print(response.choices[0].text)