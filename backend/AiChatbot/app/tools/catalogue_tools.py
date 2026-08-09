import json
from langchain.tools import tool
from app.clients.catalogue_clients import get_catalog, get_product_by_id, get_inventory


@tool
def search_products(query: str) -> str:
    """
    Search the FitFusion product catalog for products matching a name,
    category, or brand keyword (e.g. "running shoes", "protein powder", "Nike").
    Use this whenever a customer asks to see, find, or get recommendations
    for products. Returns a JSON list of matching products, each with
    id, name, categoryName, brandName, startingPrice, and description.
    Always use the 'id' field from results when calling get_product_details.
    """
    try:
        catalog = get_catalog()
        query_words = query.lower().split()

        def matches_product(p):
            searchable_text = " ".join([
                p.get("name") or "",
                p.get("categoryName") or "",
                p.get("brandName") or "",
                p.get("subCategoryName") or "",
            ]).lower()
            return any(word in searchable_text for word in query_words)

        matches = [p for p in catalog if matches_product(p)]
        return json.dumps(matches[:10])
    except Exception as e:
        return json.dumps({"error": str(e)})

@tool
def get_product_details(product_id: str) -> str:
    """
    Get full details for one specific product, including all its
    variants (size/color options), each variant's price (lowestPrice),
    MRP, and cheapestRetailerId. Use this after search_products to get
    more information about a specific product before recommending it,
    or to answer questions about a product's variants or pricing.
    """
    # print(f"DEBUG: get_product_details called with product_id='{product_id}'")
    try:
        product = get_product_by_id(product_id)
        return json.dumps(product)
    except Exception as e:
        return json.dumps({"error": str(e)})


@tool
def check_stock_and_price(variant_id: str, retailer_id: str) -> str:
    """
    Check the real-time stock quantity and current price for one
    specific product variant sold by one specific retailer. Use this
    to confirm a product is actually in stock and get the exact
    current price before telling a customer it's available. The
    variant_id and retailer_id come from get_product_details results
    (variantId and cheapestRetailerId fields).
    """
    # print(f"DEBUG: check_stock_and_price called with variant_id='{variant_id}', retailer_id='{retailer_id}'")
    try:
        inventory = get_inventory(variant_id, retailer_id)
        if isinstance(inventory, list) and len(inventory) > 0:
            return json.dumps(inventory[0])
        return json.dumps({"error": "No inventory record found"})
    except Exception as e:
        return json.dumps({"error": str(e)})