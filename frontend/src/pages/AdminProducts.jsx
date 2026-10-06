import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getImageUrl } from "../services/imageUrl";

function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await API.get("/products?limit=50");
            setProducts(Array.isArray(response.data?.products) ? response.data.products : []);
        } catch (err) {
            setProducts([]);
            setError(err.response?.data?.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const deleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            setError("");
            await API.delete(`/products/${productId}`);
            fetchProducts();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete product");
        }
    };

    if (loading) return <div className="loading-page">Loading products...</div>;

    return (
        <main className="admin-products">
            <div className="admin-products-header">
                <div>
                    <span className="eyebrow">ADMIN</span>
                    <h1>Products</h1>
                </div>
                <Link to="/admin/products/add">+ Add Product</Link>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {products.length === 0 ? (
                <div className="empty-state"><h2>No products found</h2><p>Run the product seed command or add your first product.</p></div>
            ) : (
                products.map((product) => (
                    <article className="admin-product-card" key={product._id}>
                        <img src={getImageUrl(product.image)} alt={product.name} onError={(e) => { e.currentTarget.src = "/product-placeholder.svg"; }} />
                        <div>
                            <span className="order-label">{product.category}</span>
                            <h2>{product.name}</h2>
                            <p>₹{Number(product.price).toLocaleString("en-IN")} · {product.stock} in stock</p>
                        </div>
                        <div className="admin-product-actions">
                            <button onClick={() => navigate(`/admin/products/edit/${product._id}`)}>Edit</button>
                            <button onClick={() => deleteProduct(product._id)}>Delete</button>
                        </div>
                    </article>
                ))
            )}
        </main>
    );
}

export default AdminProducts;
