import AdminSidebar from "../../Components/Admin/AdminSidebar";
import { Outlet } from "react-router-dom";

function AdminHandler() {

    return (
        <>
            <div className="d-flex flex-column vh-100">
                <div className="d-flex flex-grow-1 overflow-hidden">
                    <div className="bg-dark h-100" style={{ width: '250px', flexShrink: 0 }}>
                        <AdminSidebar  />
                    </div>
                    
                    <div className="flex-grow-1 overflow-auto bg-light p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminHandler;   