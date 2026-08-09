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

    if (loading) {
        return <h2>Loading Products...</h2>;
    }

    return (
        <>
            <Navbar />
            <div className="container py-4">
                <h1>Products</h1><hr />

                <div className="d-flex gap-4 flex-wrap px-3">
                    {products.map(product => (
                        <Card
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.startingPrice != null ? product.startingPrice.toFixed(2) : "N/A"}
                            url={product.primaryImage}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
export default Home