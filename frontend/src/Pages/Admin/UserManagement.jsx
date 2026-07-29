function UserManagement(){
    const users = [
        { id: 1, name: "John", toggle: true },
        { id: 2, name: "Alice", toggle: false },
        { id: 3, name: "Bob", toggle: true },
        { id: 4, name: "Emma", toggle: false },
        { id: 5, name: "Michael", toggle: true },
        { id: 6, name: "Sophia", toggle: false },
        { id: 7, name: "James", toggle: true },
        { id: 8, name: "Olivia", toggle: false },
        { id: 9, name: "William", toggle: true },
        { id: 10, name: "Ava", toggle: false },
        { id: 11, name: "Benjamin", toggle: true },
        { id: 12, name: "Isabella", toggle: false },
        { id: 13, name: "Lucas", toggle: true },
        { id: 14, name: "Mia", toggle: false },
        { id: 15, name: "Henry", toggle: true },
        { id: 16, name: "Charlotte", toggle: false },
        { id: 17, name: "Alexander", toggle: true },
        { id: 18, name: "Amelia", toggle: false },
        { id: 19, name: "Daniel", toggle: true },
        { id: 20, name: "Harper", toggle: false },
    ];
    return (
        <>
            <h1>User Management</h1>
            <div className="bg-white p-5 mb-3 rounded">List of all Users...</div>
            <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
                <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Toggle</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                        <span style={{ color: user.toggle ? "green" : "red" }}>
                            {user.toggle ? "ON" : "OFF"}
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </>
    );
}

export default UserManagement