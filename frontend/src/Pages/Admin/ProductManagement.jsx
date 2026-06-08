function ProductManagement(){
    const products = [
        { id: 1, name: "Laptop", toggle: true },
        { id: 2, name: "Smartphone", toggle: true },
        { id: 3, name: "Headphones", toggle: false },
        { id: 4, name: "Keyboard", toggle: true },
        { id: 5, name: "Mouse", toggle: false },
        { id: 6, name: "Monitor", toggle: true },
        { id: 7, name: "Tablet", toggle: true },
        { id: 8, name: "Printer", toggle: false },
        { id: 9, name: "Webcam", toggle: true },
        { id: 10, name: "Speaker", toggle: false },
        { id: 11, name: "SSD", toggle: true },
        { id: 12, name: "Hard Drive", toggle: true },
        { id: 13, name: "Router", toggle: false },
        { id: 14, name: "Power Bank", toggle: true },
        { id: 15, name: "Smart Watch", toggle: false },
        { id: 16, name: "Microphone", toggle: true },
        { id: 17, name: "Projector", toggle: false },
        { id: 18, name: "Camera", toggle: true },
        { id: 19, name: "Charger", toggle: true },
        { id: 20, name: "USB Cable", toggle: false },
    ];
    return (
        <>
            <h1> Product Management</h1>
            <div className="bg-white p-5 mb-3 rounded">List of all Products...</div>
            <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
                <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Toggle</th>
                </tr>
            </thead>
            <tbody>
                {products.map((prod) => (
                <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.name}</td>
                    <td>
                        <span style={{ color: prod.toggle ? "green" : "red" }}>
                            {prod.toggle ? "ON" : "OFF"}
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </>
    );
}

export default ProductManagement