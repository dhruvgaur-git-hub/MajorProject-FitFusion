import { useState } from 'react'
import Navbar1 from '../Components/Navbar1';
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosClient.post('/api/users/login', { email, password });
      const data = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", data.email);

      switch (data.role) {
        case "CUSTOMER":
          navigate("/home");
          break;
        case "RETAILER":
          navigate("/retailer/retailerdashboard");
          break;
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    }
    catch (error) {
      console.error("Login failed:", error);
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <Navbar1 />
        <div className="container w-50 mt-5">
          <h2 className="mb-3">Login</h2>
          <div className="mb-3">
            <label htmlFor='email' className="form-label">Email</label>
            <input type="email" className='form-control' id="email" placeholder='Enter email' onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor='password' className='form-label'>Password</label>
            <input type="password" className='form-control' id="password" placeholder='Enter Password' onChange={e => setPassword(e.target.value)} />
          </div>
          <div className='mb-3'>
            <button className='btn btn-success' onClick={handleLogin}>login</button>
          </div>
          <div className='mb-3 mt-5'>
            <label>New here? Create a new account!</label>
            <br />
            <Link to="/register" className="fw-semibold text-decoration-none mt-5">Register</Link>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login