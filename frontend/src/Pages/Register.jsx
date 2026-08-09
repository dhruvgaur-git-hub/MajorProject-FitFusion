import { useState } from "react"
import {Link, useNavigate } from "react-router-dom"
import Navbar1 from "../Components/Navbar1"
import axiosClient from "../api/axiosClient"
import { toast } from "react-toastify"

function Register(){
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    

    const navigate = useNavigate()

    const handleSignupClick = async () => {
        try{
            await axiosClient.post("/api/users/register/customer", {name, email, password, mobile:phone});
            toast.success("Registration Successful");
            navigate('/');

        }
        catch (error) {
            console.error(error);

            if (error.response) {
                toast.error(error.response.data.message || "Registration failed");
            } else {
                toast.error("Unable to connect to the server.");
            }
        }


        


/*     if (!name || !email || !password || !phone) {
        alert("Please fill all fields");
        return; 
    }
        */


};


    return (
        <div>
            <Navbar1 /><br></br>
            <div className="container w-50">
                <h2 className="mb-3">Register</h2>
                <div className="mb-3">
                    <label for="username" className="form-label">Name</label>
                    <input type="text" className="form-control" id="username" placeholder="Enter name" onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label for="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label for="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label for="phone" className="form-label">Phone</label>
                    <input type="tel" className="form-control" id="phone" placeholder="Enter mobile no" onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label>Already have an account ?</label>
                    <Link to='/'>Click Here To Signin</Link>
                </div>
                <div className="mb-3">
                    <label>Want to register as Retailer ?</label>
                    <Link to='/retailer/retailerregister'>Click Here</Link>
                </div>
                <div className="mb-3">
                    <button className="btn btn-success" onClick={handleSignupClick}>Signup</button>
                </div>

                

            </div>
        </div>
    )
}

export default Register