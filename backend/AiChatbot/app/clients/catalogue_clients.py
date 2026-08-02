import requests
BASE_URL=f"http://localhost:9092/api/products"

def get_catalog():
    response= requests.get(f"{BASE_URL}/catalog")
    response.raise_for_status()
    return response.json()