import { useState } from 'react'
import Navbar from '../../Components/Navbar';
import {Link, useNavigate} from 'react-router-dom'
function AdminLogin(){
    const [email, setEmail]=useState('');
    const [password, setPassword]= useState('');
    const navigate = useNavigate();
    const handleLogin = () => {
        if(email==="mohit@gmail.com" && password==="1304"){
            navigate('/admin/handler');
        }   
    };
    
    return (
        <>        
            <div style={{backgroundColor: "#ffffff", minHeight: "100vh"}}>
                <div className="container w-50 mt-5">
                    <h2 className="mb-3">Admin Login</h2>
                    <div className="mb-3">
                        <label htmlFor='email' className="form-label">Email</label>
                        <input type="email" className='form-control' id="email" placeholder='Enter email' onChange={e=>setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor='password' className='form-label'>Password</label>
                        <input type="password" className='form-control' id="password" placeholder='Enter Password' onChange={e=>setPassword(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                        <button className='btn btn-success' onClick={handleLogin}>login</button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AdminLogin