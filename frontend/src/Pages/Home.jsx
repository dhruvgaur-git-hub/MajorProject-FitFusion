import Navbar from "../Components/Navbar"
import Card from "../Components/Card"
function Home(){
    
    return(
        <>
            <Navbar />
            <div className="container py-4">
                <h1>Products</h1>
                <h2>Sports Wear</h2>
                <div className="d-flex gap-4 flex-wrap px-3">
                    <Card url="https://images.unsplash.com/photo-1759308553457-6f7f0850d9cd?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={999} name="Number 10 jersey"  />
                    <Card url="https://images.unsplash.com/photo-1585036156261-1e2ac055414d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={1200} name="Nike"/>
                    <Card url="https://plus.unsplash.com/premium_photo-1671586882634-dd6e99491d9e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={1500} name="Women Tennis Vest" />
                    <Card url="https://images.unsplash.com/photo-1765791277994-33e886a83a9d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={5500} name="Football Jersey" />
                </div>
                
                <h2>Muscle Suppliments</h2>
                <div className="d-flex gap-4 flex-wrap px-3">
                    <Card url="https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={750} name="Creatine"/>
                    <Card url="https://images.unsplash.com/photo-1595348020949-87cdfbb44174?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={1200} name="Pre-Workout"/>
                    <Card url= "https://plus.unsplash.com/premium_photo-1726217054376-1e63e1d9e63e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={5500} name="Whey Protein"/>
                    <Card url="https://images.unsplash.com/photo-1693996045838-980674653385?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" price={6000} name="Full Stack Pack"/>
                </div>
            </div>
            
        </>
    )
}
export default Home