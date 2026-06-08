import Login from "./Pages/Login"
import Home from "./Pages/Home";
import Register from "./Pages/Register"
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminHandler from "./Pages/Admin/AdminHandler";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UserManagement from "./Pages/Admin/UserManagement";
import ProductManagement from "./Pages/Admin/ProductManagement";
import RetailerManagement from "./Pages/Admin/RetailerManagement";

function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />}/>
          <Route path="/admin" element={<AdminHandler />} >
            <Route path="dashboard" element={<AdminDashboard />}/>
            <Route path="retailmng" element={<RetailerManagement />} />
            <Route path="usersmng" element={<UserManagement />} />
            <Route path="promng" element={<ProductManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
    
  )
  
}

export default App
