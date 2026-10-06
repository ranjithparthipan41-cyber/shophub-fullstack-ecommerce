import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { getImageUrl } from "../services/imageUrl";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/products/${id}`);
                setProduct(response.data.product);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            setAdding(true);
            setError("");
            await API.post("/cart", { productId: product._id, quantity: Number(quantity) });
            navigate("/cart");
        } catch (err) {
            setError(err.response?.data?.message || "Please login to add products to cart");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="loading">Loading product...</div>;
    if (error && !product) return <div className="loading"><p className="error">{error}</p></div>;
    if (!product) return <div className="loading">Product not found.</div>;

    return (
        <main className="product-details">
            <img src={getImageUrl(product.image)} alt={product.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/product-placeholder.svg"; }} />

            <div>
                <div className="detail-meta">
                    <span className="detail-chip">{product.category}</span>
                    <span className="detail-chip">{product.stock > 0 ? "In stock" : "Out of stock"}</span>
                </div>
                <h1>{product.name}</h1>
                <p className="description">{product.description}</p>
                <p className="detail-price">₹{Number(product.price).toLocaleString("en-IN")}</p>

                {error && <p className="error">{error}</p>}

                {product.stock > 0 ? (
                    <>
                        <div className="quantity-row">
                            <label htmlFor="quantity">Quantity</label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
                            />
                        </div>
                        <button className="add-cart-btn" onClick={handleAddToCart} disabled={adding}>
                            {adding ? "Adding..." : "Add to Cart"}
                        </button>
                    </>
                ) : (
                    <button className="add-cart-btn" disabled>Out of Stock</button>
                )}
            </div>
        </main>
    );
}

export default ProductDetails;
