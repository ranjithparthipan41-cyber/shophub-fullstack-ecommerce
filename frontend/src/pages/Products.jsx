import { useCallback, useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

const categories = ["Electronics", "Clothing", "Shoes", "Books", "Home", "Beauty"];

function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const params = new URLSearchParams({ page: String(page), limit: "8" });
            if (search.trim()) params.set("search", search.trim());
            if (category) params.set("category", category);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);

            const response = await API.get(`/products?${params.toString()}`);
            const data = response.data || {};

            setProducts(Array.isArray(data.products) ? data.products : []);
            setCurrentPage(Number(data.currentPage) || 1);
            setTotalPages(Math.max(Number(data.totalPages) || 1, 1));
            setTotalCount(Number(data.count) || 0);
        } catch (err) {
            setProducts([]);
            setError(err.response?.data?.message || "Unable to load products. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    }, [search, category, minPrice, maxPrice]);

    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
    };

    return (
        <main className="products-page">
            <section className="page-intro">
                <div>
                    <span className="eyebrow">SHOPHUB STORE</span>
                    <h1>Shop all products</h1>
                    <p>Discover everyday essentials, tech, fashion and more.</p>
                </div>
                {!loading && <strong className="result-count">{totalCount} products</strong>}
            </section>

            <form className="filter-bar" onSubmit={handleSearch}>
                <input
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <input type="number" min="0" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <input type="number" min="0" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                <button className="filter-primary" type="submit">Search</button>
                <button className="filter-clear" type="button" onClick={clearFilters}>Clear</button>
            </form>

            {error && <div className="error-banner">{error}</div>}

            {loading ? (
                <div className="products-grid">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div className="skeleton-card" key={index}>
                            <div className="skeleton skeleton-image" />
                            <div className="skeleton skeleton-line short" />
                            <div className="skeleton skeleton-line" />
                            <div className="skeleton skeleton-line medium" />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">⌕</div>
                    <h2>No products found</h2>
                    <p>Try another search or clear the filters.</p>
                    <button className="btn-primary" onClick={clearFilters}>View all products</button>
                </div>
            ) : (
                <>
                    <div className="products-grid">
                        {products.map((product) => <ProductCard key={product._id} product={product} />)}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => fetchProducts(currentPage - 1)}>←</button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button key={page} className={currentPage === page ? "active" : ""} onClick={() => fetchProducts(page)}>{page}</button>
                            ))}
                            <button disabled={currentPage === totalPages} onClick={() => fetchProducts(currentPage + 1)}>→</button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}

export default Products;
