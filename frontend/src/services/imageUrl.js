const serverUrl = (import.meta.env.VITE_SERVER_URL || "http://localhost:5000").replace(/\/$/, "");

export function getImageUrl(image) {
    if (!image) return "/product-placeholder.svg";

    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    return `${serverUrl}${image.startsWith("/") ? image : `/${image}`}`;
}
