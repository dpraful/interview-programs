import requests
import json

URL = "http://127.0.0.1:8000/commonpost"

# ---------------------------------------
# Change only this value:
# 1 = INSERT
# 2 = UPDATE
# ---------------------------------------
FLAG = 2

payload = {
    "groups": {
        "option": "rnsavereport",
        "flag": FLAG,

        "columnstring1": "John",
        "columnstring2": "Manager",
        "columnstring3": "225506",      # Unique Key
        "columnstring4": "IT",
        "columnstring5": "2025-11-11 15:26:00.000",
        "columnstring6": "16.00",
        "columnstring7": "",
        "columnstring8": "SIBU KURIAKOSE C",
        "columnstring9": "2025-11-11 15:26:45.563",
        "rowgroup1": "SIBU KURIAKOSE C",
        "columngroup1": "2025-11-11 15:26:45.563"
    }
}

# Modify some values automatically when updating
if FLAG == 2:
    payload["groups"]["columnstring1"] = "John Updated"
    payload["groups"]["columnstring2"] = "Senior Manager"
    payload["groups"]["columnstring4"] = "Finance"
    payload["groups"]["columnstring6"] = "20.00"
    payload["groups"]["columnstring7"] = "Updated"
    payload["groups"]["columnstring8"] = "ADMIN"
    payload["groups"]["columnstring9"] = "2025-11-12 10:05:00.000"
    payload["groups"]["rowgroup1"] = "ADMIN"
    payload["groups"]["columngroup1"] = "2025-11-12 10:05:00.000"

try:
    print(f"\nTesting {'INSERT' if FLAG == 1 else 'UPDATE'}...\n")

    response = requests.post(URL, json=payload)

    print("Status Code:", response.status_code)
    print("\nResponse:")
    print(json.dumps(response.json(), indent=4))

except requests.exceptions.RequestException as e:
    print("Error:", e)