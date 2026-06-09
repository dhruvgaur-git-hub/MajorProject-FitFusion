function RetailerManagement() {
    const retailers = [
        { id: 1, name: "ABC Retail", toggle: true },
        { id: 2, name: "City Mart", toggle: false },
        { id: 3, name: "Fresh Market", toggle: true },
        { id: 4, name: "Super Store", toggle: true },
        { id: 5, name: "Quick Buy", toggle: false },
        { id: 6, name: "Daily Needs", toggle: true },
        { id: 7, name: "Mega Retail", toggle: true },
        { id: 8, name: "Urban Shop", toggle: false },
        { id: 9, name: "Value Mart", toggle: true },
        { id: 10, name: "Easy Purchase", toggle: false },
        { id: 11, name: "Retail Hub", toggle: true },
        { id: 12, name: "Prime Stores", toggle: false },
        { id: 13, name: "Local Bazaar", toggle: true },
        { id: 14, name: "Market Point", toggle: false },
        { id: 15, name: "Shop Square", toggle: true },
        { id: 16, name: "Smart Retail", toggle: true },
        { id: 17, name: "Express Mart", toggle: false },
        { id: 18, name: "Town Store", toggle: true },
        { id: 19, name: "Global Retail", toggle: false },
        { id: 20, name: "One Stop Shop", toggle: true },
    ];

    return (
        <>
            <h1>Retailer Management</h1>

            <div className="bg-white p-5 mb-3 rounded">
                List of all Retailers...
            </div>

            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Toggle</th>
                    </tr>
                </thead>
                <tbody>
                    {retailers.map((retailer) => (
                        <tr key={retailer.id}>
                            <td>{retailer.id}</td>
                            <td>{retailer.name}</td>
                            <td>
                                <span
                                    style={{
                                        color: retailer.toggle ? "green" : "red",
                                    }}
                                >
                                    {retailer.toggle ? "ON" : "OFF"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default RetailerManagement