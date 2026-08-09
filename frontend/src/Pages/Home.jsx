import Navbar from "../Components/Navbar"
import Card from "../Components/Card"
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get("/api/products/catalog");
                console.log("Catalog response:", response.data);
                setProducts(response.data);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="home-page">
                <div className="container py-4">
                    <h3 className="fw-bold mb-1">Shop All Products</h3>
                    <p className="text-muted mb-4">Fitness gear, supplements and accessories from all FitFusion retailers.</p>

                    {loading ? (
                        <p className="text-muted">Loading products...</p>
                    ) : products.length === 0 ? (
                        <p className="text-muted">No products available right now.</p>
                    ) : (
                        <div className="product-grid">
                            {products.map(product => (
                                <Card
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.startingPrice != null ? product.startingPrice.toFixed(2) : "N/A"}
                                    mrp={product.startingMrp}
                                    url={product.primaryImage}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .home-page {
                    min-height: calc(100vh - 70px);
                    background: #f8f9fa;
                }
                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
                    gap: 20px;
                }
            `}</style>
        </>
    )
}
export default Home