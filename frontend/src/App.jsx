import Login from "./Pages/Login"
import Home from "./Pages/Home";
import Register from "./Pages/Register"
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminHandler from "./Pages/Admin/AdminHandler";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/customer/myorders" element={<MyOrders />} />
          <Route path="/customer/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/admin/login" element={<AdminLogin />}/>
          <Route path="/admin" element={<AdminHandler />} />
            <Route path="dashboard" element={<AdminDashboard />}/>
            <Route path="retailmng" element={<RetailerManagement />} />
            <Route path="usersmng" element={<UserManagement />} />
            <Route path="promng" element={<ProductManagement />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

