import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import AdminHandler from "./Pages/Admin/AdminHandler";
import RetailerDashboard from "./Pages/Retailer/RetailerDashboard";
import RetailerRegister from "./Pages/Retailer/RetailerRegister";
import RetailerProducts from "./Pages/Retailer/RetailerProducts";
import RetailerOrders from "./Pages/Retailer/RetailerOrders";
import RetailerPayouts from "./Pages/Retailer/RetailerPayouts";
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
import ProductManagement from "../src/Pages/Admin/ProductManagement";
import AdminDashboard from "../src/Pages/Admin/AdminDashboard";
import CatalogSettings from "../src/Pages/Admin/CatalogSettings";
import PayoutManagement from "../src/Pages/Admin/PayoutManagement";
import OrderManagement from "../src/Pages/Admin/OrderManagement";
import EditProfile from "../src/Pages/Customer/EditProfile"; 
import ProductDetail from "./Pages/ProductDetail";
import AIAssistant from "./Pages/Customer/AIAssistant";
import { CartProvider } from "./context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RetailerInventory from "./Pages/Retailer/RetailerInventory";

function App() {
  return (
    <CartProvider>
      <ToastContainer position="top-center" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="/admin" element={<AdminHandler />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="retailmng" element={<RetailerManagement />} />
            <Route path="promng" element={<ProductManagement />} />
            <Route path="catalogsettings" element={<CatalogSettings />} />
            <Route path="ordermng" element={<OrderManagement />} />
            <Route path="payoutmng" element={<PayoutManagement />} />
          </Route>
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/retailer/retailerdashboard" element={<RetailerDashboard />} />
          <Route path="/retailer/retailerregister" element={<RetailerRegister />} />
          <Route path="/retailer/retailerproducts" element={<RetailerProducts />} />
          <Route path="/retailer/retailerorders" element={<RetailerOrders />} />
          <Route path="/retailer/retailerpayouts" element={<RetailerPayouts />} />
          <Route path="/retailer/retailerprofile" element={<RetailerProfile />} />
          <Route path="/retailer/retailerinventory" element={<RetailerInventory />} />
          <Route path="/customer/assistant" element={<AIAssistant />} />
                  </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
export default App;