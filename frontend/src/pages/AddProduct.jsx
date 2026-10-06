import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "", image: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            await API.post("/products", { ...form, price: Number(form.price), stock: Number(form.stock) });
            navigate("/admin/products");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="add-product">
            <span className="eyebrow">ADMIN</span>
            <h1>Add Product</h1>
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Product name" value={form.name} onChange={update} required />
                <textarea name="description" placeholder="Product description" value={form.description} onChange={update} required />
                <input name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={update} required />
                <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={update} required />
                <input name="category" placeholder="Category" value={form.category} onChange={update} required />
                <input name="image" type="url" placeholder="Image URL" value={form.image} onChange={update} required />
                <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Product"}</button>
            </form>
        </main>
    );
}

export default AddProduct;
