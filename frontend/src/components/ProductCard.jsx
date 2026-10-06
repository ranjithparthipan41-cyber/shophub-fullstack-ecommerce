import { Link } from "react-router-dom";
import { getImageUrl } from "../services/imageUrl";

function ProductCard({ product }) {
    const image = getImageUrl(product.image);

    return (
        <article className="product-card">
            <Link className="product-card-image" to={`/products/${product._id}`}>
                <img
                    src={image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/product-placeholder.svg";
                    }}
                />
            </Link>

            <div className="product-card-body">
                <span className="product-card-category">{product.category}</span>
                <h2>{product.name}</h2>
                <p className="product-card-description">{product.description}</p>

                <div className="product-card-bottom">
                    <div>
                        <p className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
                        <span className={product.stock > 0 ? "stock" : "stock stock-out"}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                    </div>
                    <Link className="card-link" to={`/products/${product._id}`}>
                        View Product
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
