import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import ProfileCard from "../../Components/ProfileCard";
import Dhruv from "../../assets/Dhruv.jpeg";
function Profile() {
  const [user, setUser] = useState(null);


  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:9091/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile.");
    }
  };
   useEffect(() => {
    getProfile();
  }, []);
 

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h3>Loading...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />


      <div className="container flex-center my-4">
        <h2>Your Profile</h2>

        <ProfileCard
          url={Dhruv}
          name={user.name}
          email={user.email}
          mobile={user.mobile}
          role={user.role}
        />
      </div>
    </>
  );
}

export default Profile;