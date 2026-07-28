import Navbar from "../Components/Navbar"
import Card from "../Components/Card"
import { useEffect, useState } from "react";
import axios from "axios";
function Home(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const fetchProducts= async ()=>{
            try{
                const response= await axios.get("http://localhost:9092/products/catalog");
                setProducts(response.data);
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }
        fetchProducts();

    },[]);
    
    if (loading) {
        return <h2>Loading Products...</h2>;
    }

    return(
        <>
            <Navbar />

             <div className="container py-4">
                <h1>Products</h1><hr></hr>
                
                <div className="d-flex gap-4 flex-wrap px-3">
                    {products.map(product => (
                        <Card
                            key={product.id}
                            name={product.name}
                            price="View Details"
                            url={product.primaryImage}
                        />
                    ))}
                </div> 
            </div>
        </>
    )
}
export default Home


      {/*       <div className="container py-4"> */}

{/*             

            <hr />
<h2>Sports Wear</h2>
                <h2>Muscle Suppliments</h2>
                <div className="d-flex gap-4 flex-wrap px-3">
            <div className="d-flex gap-4 flex-wrap">

                {products.map(product => (

                    <Card
                        key={product.id}
                        name={product.name}
                        price={product.variants[0].mrp}
                        url={product.primaryImage}
                    />

                ))}

            </div> */}