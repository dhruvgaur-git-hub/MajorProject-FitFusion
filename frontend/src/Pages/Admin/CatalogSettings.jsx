import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

const TABS = [
    { id: "categories", label: "Categories" },
    { id: "subcategories", label: "Subcategories" },
    { id: "brands", label: "Brands" },
    { id: "attributes", label: "Attributes" },
    { id: "commission", label: "Commission Rules" },
    { id: "discount", label: "Discount Rules" },
];

const emptyCategoryForm = { name: "", description: "" };
const emptySubCategoryForm = { categoryId: "", name: "", description: "" };
const emptyBrandForm = { name: "", code: "", description: "" };
const emptyAttributeForm = {
    subCategoryId: "",
    fields: [{ name: "", type: "TEXT", required: false, allowedValues: "" }],
};
const emptyCommissionForm = { categoryId: "", commissionPercent: "" };
const emptyDiscountForm = { categoryId: "", discountPercent: "" };

function StatusBadge({ active }) {
    return (
        <span className={`badge ${active ? "bg-success" : "bg-secondary"}`}>
            {active ? "Active" : "Inactive"}
        </span>
    );
}

function CatalogSettings() {
    const [activeTab, setActiveTab] = useState("categories");

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [attributeDefs, setAttributeDefs] = useState([]);
    const [commissionRules, setCommissionRules] = useState([]);
    const [discountRules, setDiscountRules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
    const [subCategoryForm, setSubCategoryForm] = useState(emptySubCategoryForm);
    const [brandForm, setBrandForm] = useState(emptyBrandForm);
    const [attributeForm, setAttributeForm] = useState(emptyAttributeForm);
    const [commissionForm, setCommissionForm] = useState(emptyCommissionForm);
    const [discountForm, setDiscountForm] = useState(emptyDiscountForm);

    const [submitting, setSubmitting] = useState(false);

    const categoryName = (id) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === id) {
                return categories[i].name;
            }
        }
        return id;
    };
    const subCategoryName = (id) => {
    for (let i = 0; i < subCategories.length; i++) {
        if (subCategories[i].id === id) {
            return subCategories[i].name;
        }
    }
    return id;
  };

    const fetchAll = async () => {
    setLoading(true);
    try {
        const [catRes, subRes, brandRes, attrRes, commRes, discRes] = await Promise.all([
            axiosClient.get("/api/categories/fetchAllCategories"),
            axiosClient.get("/api/subcategories/fetchAllSubCategories"),
            axiosClient.get("/api/brands/fetchAllBrands"),
            axiosClient.get("/api/attribute/fetchAll"),
            axiosClient.get("/api/commission-rules"),
            axiosClient.get("/api/discount-rules"),
        ]);
        setCategories(catRes.data);
        setSubCategories(subRes.data);
        setBrands(brandRes.data);
        setAttributeDefs(attrRes.data);
        setCommissionRules(commRes.data);
        setDiscountRules(discRes.data);
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load catalog settings.");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchAll();
    }, []);

    // ---------- Category ----------
    const addCategory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post("/api/categories/addcategory", categoryForm);
            toast.success("Category added");
            setCategoryForm(emptyCategoryForm);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add category.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateCategory = async (id) => {
        try {
            await axiosClient.delete(`/api/categories/deleteById/${id}`);
            toast.success("Category deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate category.");
        }
    };

    const restoreCategory = async (id) => {
        try {
            await axiosClient.patch(`/api/categories/${id}/restore`);
            toast.success("Category restored");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to restore category.");
        }
    };

    // ---------- SubCategory ----------
    const addSubCategory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post("/api/subcategories/addSubCategory", subCategoryForm);
            toast.success("Subcategory added");
            setSubCategoryForm(emptySubCategoryForm);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add subcategory.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateSubCategory = async (id) => {
        try {
            await axiosClient.delete(`/api/subcategories/deleteById/${id}`);
            toast.success("Subcategory deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate subcategory.");
        }
    };

    const restoreSubCategory = async (id) => {
        try {
            await axiosClient.patch(`/api/subcategories/${id}/restore`);
            toast.success("Subcategory restored");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to restore subcategory.");
        }
    };

    // ---------- Brand ----------
    const addBrand = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post("/api/brands/addbrand", brandForm);
            toast.success("Brand added");
            setBrandForm(emptyBrandForm);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add brand.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateBrand = async (id) => {
        try {
            await axiosClient.delete(`/api/brands/deleteById/${id}`);
            toast.success("Brand deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate brand.");
        }
    };

    const restoreBrand = async (id) => {
        try {
            await axiosClient.patch(`/api/brands/${id}/restore`);
            toast.success("Brand restored");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to restore brand.");
        }
    };

    // ---------- Attribute Definitions ----------
    const addFieldRow = () => {
        setAttributeForm((prev) => ({
            ...prev,
            fields: [...prev.fields, { name: "", type: "TEXT", required: false, allowedValues: "" }],
        }));
    };

    const removeFieldRow = (index) => {
        setAttributeForm((prev) => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index),
        }));
    };

    const updateFieldRow = (index, key, value) => {
        setAttributeForm((prev) => ({
            ...prev,
            fields: prev.fields.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
        }));
    };

    const addAttributeDefinition = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                subCategoryId: attributeForm.subCategoryId,
                attributes: attributeForm.fields.map((f) => ({
                    name: f.name,
                    type: f.type,
                    required: f.required,
                    allowedValues:
                        f.type === "DROPDOWN"
                            ? f.allowedValues.split(",").map((v) => v.trim()).filter(Boolean)
                            : [],
                })),
            };
            await axiosClient.post("/api/attribute/addAttribute", payload);
            toast.success("Attribute definition added");
            setAttributeForm(emptyAttributeForm);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add attribute definition.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateAttributeDefinition = async (id) => {
        try {
            await axiosClient.delete(`/api/attribute/${id}`);
            toast.success("Attribute definition deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate attribute definition.");
        }
    };

    const restoreAttributeDefinition = async (id) => {
        try {
            await axiosClient.patch(`/api/attribute/${id}/restore`);
            toast.success("Attribute definition restored");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to restore attribute definition.");
        }
    };

    // ---------- Commission Rules ----------
    const addCommissionRule = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post("/api/commission-rules", {
                categoryId: commissionForm.categoryId,
                commissionPercent: Number(commissionForm.commissionPercent),
            });
            toast.success("Commission rule saved — it is now the active rule for this category");
            setCommissionForm(emptyCommissionForm);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save commission rule.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateCommissionRule = async (ruleId, categoryId) => {
        try {
            await axiosClient.delete(`/api/commission-rules/${ruleId}`, { params: { categoryId } });
            toast.success("Commission rule deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate commission rule.");
        }
    };

    const activateCommissionRule = async (ruleId, categoryId) => {
        try {
            await axiosClient.patch(`/api/commission-rules/${ruleId}/activate`, null, { params: { categoryId } });
            toast.success("Commission rule activated — the previous active rule for this category was deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to activate commission rule.");
        }
    };

    // ---------- Discount Rules ----------
    const addDiscountRule = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post("/api/discount-rules", {
                categoryId: discountForm.categoryId,
                discountPercent: Number(discountForm.discountPercent),
            });
            toast.success("Discount rule saved — it is now the active rule for this category");
            setDiscountForm(emptyDiscountForm);
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save discount rule.");
        } finally {
            setSubmitting(false);
        }
    };

    const deactivateDiscountRule = async (ruleId, categoryId) => {
        try {
            await axiosClient.delete(`/api/discount-rules/${ruleId}`, { params: { categoryId } });
            toast.success("Discount rule deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to deactivate discount rule.");
        }
    };

    const activateDiscountRule = async (ruleId, categoryId) => {
        try {
            await axiosClient.patch(`/api/discount-rules/${ruleId}/activate`, null, { params: { categoryId } });
            toast.success("Discount rule activated — the previous active rule for this category was deactivated");
            fetchAll();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to activate discount rule.");
        }
    };

    return (
        <>
            <h1>Catalog Settings</h1>
            <p className="text-muted">
                Manage categories, subcategories, and brands (retailers pick these when adding a
                product), and the commission/discount rules tied to each category.
            </p>

            <ul className="nav nav-tabs mb-3 catalog-tabs">
                {TABS.map((tab) => (
                    <li className="nav-item" key={tab.id}>
                        <button
                            className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            <style>{`
                .catalog-tabs .nav-link {
                    color: #6c757d;
                    border: none;
                    border-bottom: 3px solid transparent;
                    font-weight: 500;
                }
                .catalog-tabs .nav-link:hover {
                    color: #ff6b35;
                    border-color: transparent;
                }
                .catalog-tabs .nav-link.active {
                    color: #ff6b35;
                    background: transparent;
                    border-color: transparent transparent #ff6b35;
                }
            `}</style>

            {loading ? (
                <div className="bg-white p-5 rounded">Loading catalog settings...</div>
            ) : (
                <>
                    {activeTab === "categories" && (
                        <div className="bg-white p-4 rounded">
                            <form className="row g-2 align-items-end mb-4" onSubmit={addCategory}>
                                <div className="col-md-4">
                                    <label className="form-label">Name</label>
                                    <input
                                        className="form-control"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label">Description</label>
                                    <input
                                        className="form-control"
                                        value={categoryForm.description}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-brand w-100" disabled={submitting}>
                                        Add Category
                                    </button>
                                </div>
                            </form>

                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center text-muted py-4">No categories yet.</td></tr>
                                    ) : (
                                        categories.map((cat) => (
                                            <tr key={cat.id}>
                                                <td>{cat.name}</td>
                                                <td>{cat.description}</td>
                                                <td><StatusBadge active={cat.active} /></td>
                                                <td>
                                                    {cat.active ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deactivateCategory(cat.id)}>Deactivate</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => restoreCategory(cat.id)}>Restore</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "subcategories" && (
                        <div className="bg-white p-4 rounded">
                            <form className="row g-2 align-items-end mb-4" onSubmit={addSubCategory}>
                                <div className="col-md-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={subCategoryForm.categoryId}
                                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.filter((c) => c.active).map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        className="form-control"
                                        value={subCategoryForm.name}
                                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Description</label>
                                    <input
                                        className="form-control"
                                        value={subCategoryForm.description}
                                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-brand w-100" disabled={submitting}>
                                        Add
                                    </button>
                                </div>
                            </form>

                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Category</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subCategories.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted py-4">No subcategories yet.</td></tr>
                                    ) : (
                                        subCategories.map((sub) => (
                                            <tr key={sub.id}>
                                                <td>{categoryName(sub.categoryId)}</td>
                                                <td>{sub.name}</td>
                                                <td>{sub.description}</td>
                                                <td><StatusBadge active={sub.active} /></td>
                                                <td>
                                                    {sub.active ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deactivateSubCategory(sub.id)}>Deactivate</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => restoreSubCategory(sub.id)}>Restore</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "brands" && (
                        <div className="bg-white p-4 rounded">
                            <form className="row g-2 align-items-end mb-4" onSubmit={addBrand}>
                                <div className="col-md-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        className="form-control"
                                        value={brandForm.name}
                                        onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Code</label>
                                    <input
                                        className="form-control"
                                        value={brandForm.code}
                                        onChange={(e) => setBrandForm({ ...brandForm, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g. NIKE"
                                        required
                                    />
                                </div>
                                <div className="col-md-5">
                                    <label className="form-label">Description</label>
                                    <input
                                        className="form-control"
                                        value={brandForm.description}
                                        onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button className="btn btn-brand w-100" disabled={submitting}>
                                        Add
                                    </button>
                                </div>
                            </form>

                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted py-4">No brands yet.</td></tr>
                                    ) : (
                                        brands.map((brand) => (
                                            <tr key={brand.id}>
                                                <td>{brand.name}</td>
                                                <td>{brand.code}</td>
                                                <td>{brand.description}</td>
                                                <td><StatusBadge active={brand.active} /></td>
                                                <td>
                                                    {brand.active ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deactivateBrand(brand.id)}>Deactivate</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => restoreBrand(brand.id)}>Restore</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === "attributes" && (
                        <div className="bg-white p-4 rounded">
                            <form className="mb-4" onSubmit={addAttributeDefinition}>
                                <div className="row g-2 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Sub-Category</label>
                                        <select
                                            className="form-select"
                                            value={attributeForm.subCategoryId}
                                            onChange={(e) => setAttributeForm({ ...attributeForm, subCategoryId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select sub-category</option>
                                            {subCategories.filter((s) => s.active).map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {attributeForm.fields.map((field, index) => (
                                    <div className="row g-2 align-items-end mb-2" key={index}>
                                        <div className="col-md-3">
                                            <label className="form-label">Field Name</label>
                                            <input
                                                className="form-control"
                                                value={field.name}
                                                onChange={(e) => updateFieldRow(index, "name", e.target.value)}
                                                placeholder="e.g. Color"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label className="form-label">Type</label>
                                            <select
                                                className="form-select"
                                                value={field.type}
                                                onChange={(e) => updateFieldRow(index, "type", e.target.value)}
                                            >
                                                <option value="TEXT">Text</option>
                                                <option value="NUMBER">Number</option>
                                                <option value="BOOLEAN">Boolean</option>
                                                <option value="DROPDOWN">Dropdown</option>
                                            </select>
                                        </div>
                                        {field.type === "DROPDOWN" && (
                                            <div className="col-md-4">
                                                <label className="form-label">Allowed Values (comma-separated)</label>
                                                <input
                                                    className="form-control"
                                                    value={field.allowedValues}
                                                    onChange={(e) => updateFieldRow(index, "allowedValues", e.target.value)}
                                                    placeholder="Black, White, Red"
                                                />
                                            </div>
                                        )}
                                        <div className="col-md-2 form-check ms-2">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={field.required}
                                                onChange={(e) => updateFieldRow(index, "required", e.target.checked)}
                                                id={`required-${index}`}
                                            />
                                            <label className="form-check-label" htmlFor={`required-${index}`}>Required</label>
                                        </div>
                                        <div className="col-md-1">
                                            {attributeForm.fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeFieldRow(index)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex gap-2 mt-3">
                                    <button type="button" className="btn btn-outline-secondary" onClick={addFieldRow}>
                                        + Add Field
                                    </button>
                                    <button type="submit" className="btn btn-brand" disabled={submitting}>
                                        Save Attribute Definition
                                    </button>
                                </div>
                            </form>

                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Sub-Category</th>
                                        <th>Fields</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attributeDefs.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center text-muted py-4">No attribute definitions yet.</td></tr>
                                    ) : (
                                        attributeDefs.map((def) => (
                                            <tr key={def.id}>
                                                <td>{subCategoryName(def.subCategoryId)}</td>
                                                <td>
                                                    {def.attributes.map((f, i) => (
                                                        <span key={i} className="badge bg-light text-dark border me-1">
                                                            {f.name} ({f.type}{f.required ? ", required" : ""})
                                                        </span>
                                                    ))}
                                                </td>
                                                <td><StatusBadge active={def.active} /></td>
                                                <td>
                                                    {def.active ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deactivateAttributeDefinition(def.id)}>Deactivate</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => restoreAttributeDefinition(def.id)}>Restore</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "commission" && (
                        <div className="bg-white p-4 rounded">
                            <form className="row g-2 align-items-end mb-4" onSubmit={addCommissionRule}>
                                <div className="col-md-5">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={commissionForm.categoryId}
                                        onChange={(e) => setCommissionForm({ ...commissionForm, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.filter((c) => c.active).map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Commission %</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="2"
                                        max="100"
                                        className="form-control"
                                        value={commissionForm.commissionPercent}
                                        onChange={(e) => setCommissionForm({ ...commissionForm, commissionPercent: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-brand w-100" disabled={submitting}>
                                        Save Rule
                                    </button>
                                </div>
                            </form>
                            <p className="text-muted small">
                                Saving a new rule for a category supersedes its current active rule automatically — old rules are kept as history, not deleted.
                            </p>

                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Category</th>
                                        <th>Commission %</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commissionRules.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center text-muted py-4">No commission rules yet.</td></tr>
                                    ) : (
                                        commissionRules.map((rule) => (
                                            <tr key={rule.id}>
                                                <td>{categoryName(rule.categoryId)}</td>
                                                <td>{rule.commissionPercent}%</td>
                                                <td><StatusBadge active={rule.active} /></td>
                                                <td>
                                                    {rule.active ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deactivateCommissionRule(rule.id, rule.categoryId)}>Deactivate</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => activateCommissionRule(rule.id, rule.categoryId)}>Activate</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === "discount" && (
                        <div className="bg-white p-4 rounded">
                            <form className="row g-2 align-items-end mb-4" onSubmit={addDiscountRule}>
                                <div className="col-md-5">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={discountForm.categoryId}
                                        onChange={(e) => setDiscountForm({ ...discountForm, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.filter((c) => c.active).map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Discount %</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        className="form-control"
                                        value={discountForm.discountPercent}
                                        onChange={(e) => setDiscountForm({ ...discountForm, discountPercent: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-brand w-100" disabled={submitting}>
                                        Save Rule
                                    </button>
                                </div>
                            </form>
                            <p className="text-muted small">
                                Saving a new rule for a category supersedes its current active rule automatically — old rules are kept as history, not deleted.
                            </p>

                            <table className="table table-striped table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Category</th>
                                        <th>Discount %</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {discountRules.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center text-muted py-4">No discount rules yet.</td></tr>
                                    ) : (
                                        discountRules.map((rule) => (
                                            <tr key={rule.id}>
                                                <td>{categoryName(rule.categoryId)}</td>
                                                <td>{rule.discountPercent}%</td>
                                                <td><StatusBadge active={rule.active} /></td>
                                                <td>
                                                    {rule.active ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deactivateDiscountRule(rule.id, rule.categoryId)}>Deactivate</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => activateDiscountRule(rule.id, rule.categoryId)}>Activate</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default CatalogSettings;
