import requests
CATALOG_BASE_URL = "http://localhost:9092/api/products"
INVENTORY_BASE_URL = "http://localhost:9092/api/inventory"

def get_catalog():
    response = requests.get(f"{CATALOG_BASE_URL}/catalog")
    response.raise_for_status()
    return response.json()


def get_product_by_id(product_id: str):
    response = requests.get(f"{CATALOG_BASE_URL}/{product_id}")
    response.raise_for_status()
    return response.json()


def get_inventory(variant_id: str, retailer_id: str):
    response = requests.get(
        f"{INVENTORY_BASE_URL}/variant/{variant_id}/retailer/{retailer_id}"
    )
    response.raise_for_status()
    return response.json()