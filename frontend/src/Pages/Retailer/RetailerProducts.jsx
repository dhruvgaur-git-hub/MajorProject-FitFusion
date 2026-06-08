import RetailerNavbar from "../../Components/Retailer/RetailerNavbar";

function RetailerProducts() {
    return (
        <>
        <RetailerNavbar />
        <div style={{ padding: '20px' }}>
            <h1>Produts</h1>
            <button style={{ float: 'right' }} className="btn btn-primary">Add Product</button>
        </div>
        </> 
        
    );
}
export default RetailerProducts;