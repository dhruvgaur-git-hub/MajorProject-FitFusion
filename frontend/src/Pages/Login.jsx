import { useState } from 'react'
import Navbar1 from '../Components/Navbar1';
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

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
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <>
      <div className="auth-page">
        <Navbar1 />
        <div className="container">
          <div className="auth-card">
            <h3 className="fw-bold mb-1">Welcome back</h3>
            <p className="text-muted mb-4">Log in to your FitFusion account</p>

            <div className="mb-3">
              <label htmlFor='email' className="form-label">Email</label>
              <input type="email" className='form-control auth-input' id="email" placeholder='Enter email' onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <label htmlFor='password' className='form-label'>Password</label>
              <input type="password" className='form-control auth-input' id="password" placeholder='Enter Password' onChange={e => setPassword(e.target.value)} />
            </div>

            <button className='btn btn-brand w-100' onClick={handleLogin}>Login</button>

            <p className='text-muted text-center mt-4 mb-0'>
              New here? <Link to="/register" className="text-brand fw-semibold text-decoration-none">Create an account</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: #f8f9fa;
        }
        .auth-card {
          background: #fff;
          border: 1px solid #eceef1;
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.05);
          padding: 40px;
          max-width: 420px;
          margin: 60px auto 0;
        }
        .auth-input:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.15);
        }
      `}</style>
    </>
  )
}
export default Login