import os
import requests

CATALOG_SERVICE_URL = os.getenv("CATALOG_SERVICE_URL", "http://localhost:9092")
CATALOG_BASE_URL = f"{CATALOG_SERVICE_URL}/api/products"
INVENTORY_BASE_URL = f"{CATALOG_SERVICE_URL}/api/inventory"


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