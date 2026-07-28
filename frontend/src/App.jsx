import Login from "./Pages/Login"
import Home from "./Pages/Home";
import Register from "./Pages/Register"
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminHandler from "./Pages/Admin/AdminHandler";
import RetailerLogin from "./Pages/Retailer/RetailerLogin";
import RetailerDashboard from "./Pages/Retailer/RetailerDashboard";
import RetailerRegister from "./Pages/Retailer/RetailerRegister";
import RetailerProducts from "./Pages/Retailer/RetailerProducts";
import RetailerOrders from "./Pages/Retailer/RetailerOrders";
import RetailerProfile from "./Pages/Retailer/RetailerProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "../src/Pages/Customer/Cart";
import Checkout from "./Pages/Customer/Checkout";
import Payment from "../src/Pages/Customer/Payment";
import Profile from "./Pages/Customer/Profile";
import AboutUs from "./Pages/AboutUs";
import MyOrders from "../src/Pages/Customer/MyOrders";
import OrderDetails from "./Pages/Customer/OrderDetails"; 
import RetailerManagement from "../src/Pages/Admin/RetailerManagement";
import UserManagement from "../src/Pages/Admin/UserManagement";
import ProductManagement from "../src/Pages/Admin/ProductManagement";
import AdminDashboard from "../src/Pages/Admin/AdminDashboard";
import EditProfile from "../src/Pages/Customer/EditProfile"; 

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
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/customer/myorders" element={<MyOrders />} />
          <Route path="/customer/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/admin/login" element={<AdminLogin />}/>
          <Route path="/admin" element={<AdminHandler />} >
            <Route path="dashboard" element={<AdminDashboard />}/>
            <Route path="retailmng" element={<RetailerManagement />} />
            <Route path="usersmng" element={<UserManagement />} />
            <Route path="promng" element={<ProductManagement />} />
          </Route>
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

