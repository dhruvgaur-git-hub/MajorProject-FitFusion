import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [availableStock, setAvailableStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/api/products/${id}`);
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
  const fetchStock = async () => {
    if (!selectedVariant || !selectedVariant.cheapestRetailerId) {
      setAvailableStock(null);
      return;
    }
    try {
      const response = await axiosClient.get(
        `/api/inventory/variant/${selectedVariant.variantId}/retailer/${selectedVariant.cheapestRetailerId}`
      );
      const data = response.data[0];
      if (!data) {
        setAvailableStock(0);
        return;
      }
      setAvailableStock(data.quantity - (data.reservedQuantity || 0));
    } catch (error) {
      console.error("Failed to fetch stock:", error);
      setAvailableStock(0);
    }
  };
  fetchStock();
}, [selectedVariant]);

  const handleAddToCart = () => {
    if (!selectedVariant || !availableStock || availableStock <= 0) return;

    addToCart({
      productId: product.id,
      categoryId: product.categoryId,
      variantId: selectedVariant.variantId,
      sku: selectedVariant.sku,
      productName: product.name,
      retailerId: selectedVariant.cheapestRetailerId,
      mrp: selectedVariant.mrp,
      sellingPrice: selectedVariant.lowestPrice,
      primaryImage: product.primaryImage,
      attributes: selectedVariant.attributes,
      availableStock: availableStock,
    });

    navigate("/customer/cart");
  };

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <div>
      <Navbar />
      <div className="container py-4">
        <div className="row">
          <div className="col-md-5">
            <img
              src={product.primaryImage}
              className="img-fluid rounded"
              alt={product.name}
            />
          </div>

          <div className="col-md-7">
            <h2>{product.name}</h2>
            <p className="text-muted">{product.brandName} · {product.categoryName}</p>
            <p>{product.description}</p>

            {selectedVariant && (
              <>
                <h3 className="mt-3">
                  ₹{selectedVariant.lowestPrice.toFixed(2)}
                  {selectedVariant.mrp > selectedVariant.lowestPrice && (
                    <small className="text-muted text-decoration-line-through ms-2">
                      ₹{selectedVariant.mrp.toFixed(2)}
                    </small>
                  )}
                </h3>

                {availableStock !== null && (
                  <p className={availableStock > 0 ? "text-success" : "text-danger"}>
                    {availableStock > 0 ? `In Stock: ${availableStock}` : "Out of Stock"}
                  </p>
                )}

                <div className="mt-3">
                  <strong>Select Variant:</strong>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.variantId}
                        className={`btn ${
                          selectedVariant.variantId === variant.variantId
                            ? "btn-dark"
                            : "btn-outline-dark"
                        }`}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        {Object.entries(variant.attributes || {})
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="btn btn-success mt-4 w-100"
                  onClick={handleAddToCart}
                  disabled={!availableStock || availableStock <= 0}
                >
                  {availableStock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;