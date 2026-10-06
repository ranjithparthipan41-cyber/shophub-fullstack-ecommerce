import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "", image: "" });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                const product = response.data.product;
                setForm({ name: product.name || "", description: product.description || "", price: product.price || "", stock: product.stock || 0, category: product.category || "", image: product.image || "" });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const update = (e) => setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            setError("");
            await API.put(`/products/${id}`, { ...form, price: Number(form.price), stock: Number(form.stock) });
            navigate("/admin/products");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update product");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="loading-page">Loading product...</div>;

    return (
        <main className="edit-product">
            <span className="eyebrow">ADMIN</span>
            <h1>Edit Product</h1>
            {error && <div className="error-banner">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Product name" value={form.name} onChange={update} required />
                <textarea name="description" placeholder="Product description" value={form.description} onChange={update} required />
                <input name="price" type="number" min="0" placeholder="Price" value={form.price} onChange={update} required />
                <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={update} required />
                <input name="category" placeholder="Category" value={form.category} onChange={update} required />
                <input name="image" type="url" placeholder="Image URL" value={form.image} onChange={update} required />
                <button type="submit" disabled={updating}>{updating ? "Updating..." : "Save Changes"}</button>
            </form>
        </main>
    );
}

export default EditProduct;
