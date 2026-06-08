import logo from '../../assets/logo.png';
function RetailerNavbar(){
    return(
        <>
        <nav className="navbar bg-dark navbar-dark">
            <div className="container">
                <a className="navbar-brand" href="#">
                    <img src={logo} alt="FitFusion Logo" style={{ height: '45px', width: 'auto', borderRadius: '40px'}} />
                </a>
                <ul className="d-flex justify-content-center gap-5 list-unstyled mb-0">
                    <li>
                        <a className="text-white text-decoration-none" href="/retailer/retailerdashboard">
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="/retailer/retailerproducts">
                            Products
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="/retailer/retailerorders">
                            Orders
                        </a>
                    </li>
                    <li>
                        <a className="text-white text-decoration-none" href="/retailer/retailerprofile">
                            Profile
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        </>
        
    )
}
export default RetailerNavbar
