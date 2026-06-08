import Login from "./Pages/Login"
import Home from "./Pages/Home";
import Register from "./Pages/Register"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./Pages/Customer/Cart";
import Checkout from "./Pages/Customer/Checkout";
import Payment from "./Pages/Customer/Payment";

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
