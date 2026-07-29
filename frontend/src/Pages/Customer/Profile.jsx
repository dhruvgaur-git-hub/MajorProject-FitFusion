import Navbar from "../../Components/Navbar"
import ProfileCard from "../../Components/ProfileCard"
function Profile(){
    return(
        <>
        <Navbar />
        <div className="container flex-center my-4">
            <h2>Your Profile</h2>
            <ProfileCard url="https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" name="David Gosling"/>
        </div>
        </>
    )   
}
export default Profile
