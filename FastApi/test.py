import requests
import json

URL = "http://127.0.0.1:8000/commonpost"

payload = {
    "groups": {
        "option": "rnsavereport",
        "columnstring1": "John",
        "columnstring2": "Manager",
        "columnstring3": "IT"
    }
}

try:
    response = requests.post(URL, json=payload)

    print("Status Code:", response.status_code)
    print("Response:")
    print(json.dumps(response.json(), indent=4))

except requests.exceptions.RequestException as e:
    print("Error:", e)