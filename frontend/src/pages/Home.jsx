import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { getImageUrl } from "../services/imageUrl";

function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await API.get("/products?limit=4");
                setProducts(response.data.products || []);
            } catch (error) {
                console.error(error);
            }
        };

        loadProducts();
    }, []);

    const featured = products[0];

    return (
        <main className="home">
            <section className="hero-section">
                <div className="hero-content">
                    <div>
                        <span className="hero-badge">NEW COLLECTION • 2026</span>
                        <h1>Everything you need. <span>One place.</span></h1>
                        <p>
                            Discover quality products, simple checkout and a smooth shopping
                            experience built with the MERN stack.
                        </p>
                        <div className="hero-actions">
                            <Link className="btn-primary" to="/products">Shop Products</Link>
                            <Link className="btn-secondary" to="/register">Create Account</Link>
                        </div>
                    </div>

                    {featured ? (
                        <div className="hero-card">
                            <img src={getImageUrl(featured.image)} alt={featured.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/product-placeholder.svg"; }} />
                            <div className="hero-card-meta">
                                <h3>{featured.name}</h3>
                                <p>Featured product • ₹{Number(featured.price).toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="hero-card">
                            <div className="hero-card-meta">
                                <h3>ShopHub Store</h3>
                                <p>Products are loading...</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="section">
                <div className="section-heading">
                    <div>
                        <h2>Trending products</h2>
                        <p>Popular picks from the ShopHub catalog.</p>
                    </div>
                    <Link className="btn-secondary" to="/products">View all</Link>
                </div>

                {products.length > 0 ? (
                    <div className="products-grid">
                        {products.map((product) => <ProductCard key={product._id} product={product} />)}
                    </div>
                ) : (
                    <div className="empty-state">Add products from the admin dashboard to see them here.</div>
                )}
            </section>
        </main>
    );
}

export default Home;
