import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Navbar1 from "../../Components/Navbar1";
import { toast } from "react-toastify";

function EditProfile() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const navigate = useNavigate();

  const handleUpdate = async () => {
    try {
      const response = await axiosClient.put("/api/users/editprofile", { name, mobile });

      toast.success("Profile updated successfully!");
      console.log(response.data);

      navigate("/customer/profile");
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.message || "Failed to update profile.");
      } else {
        toast.error("Server error.");
      }
    }
  };

  return (
    <>
      <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <Navbar1 />

        <div className="container w-50 mt-5">
          <h2 className="mb-3">Update Profile</h2>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>

            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="mobile" className="form-label">
              Mobile
            </label>

            <input
              type="text"
              className="form-control"
              id="mobile"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <button className="btn btn-success" onClick={handleUpdate}>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;