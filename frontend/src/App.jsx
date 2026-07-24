import Login from "./Pages/Login"
import Home from "./Pages/Home";
import Register from "./Pages/Register"
import RetailerLogin from "./Pages/Retailer/RetailerLogin";
import RetailerDashboard from "./Pages/Retailer/RetailerDashboard";
import RetailerRegister from "./Pages/Retailer/RetailerRegister";
import RetailerProducts from "./Pages/Retailer/RetailerProducts";
import RetailerOrders from "./Pages/Retailer/RetailerOrders";
import RetailerProfile from "./Pages/Retailer/RetailerProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./Pages/Customer/Cart";
import Checkout from "./Pages/Customer/Checkout";
import Payment from "./Pages/Customer/Payment";
import Profile from "./Pages/Customer/Profile";

function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {<Login />} />
          <Route path="/login" element= {<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/customer/cart" element={<Cart />} />
          <Route path="/customer/checkout" element={<Checkout />} />
          <Route path="/customer/payment" element={<Payment />} />
          <Route path="customer/profile" element={<Profile />} /> 
          <Route path="/retailer/retailerlogin" element={<RetailerLogin />} />
          <Route path="/retailer/retailerdashboard" element={<RetailerDashboard />} />
          <Route path="/retailer/retailerregister" element={<RetailerRegister />} />
          <Route path="/retailer/retailerproducts" element={<RetailerProducts />} />
          <Route path="/retailer/retailerorders" element={<RetailerOrders />} />
          <Route path="/retailer/retailerprofile" element={<RetailerProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
