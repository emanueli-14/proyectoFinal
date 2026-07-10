import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const imageUrl =
		product.image_url ||
		"https://via.placeholder.com/600x400?text=Producto";

	const handleAddToCart = async () => {
		const token = localStorage.getItem("token");

		setMessage("");
		setError("");

		if (!token) {
			navigate("/login");
			return;
		}

		try {
			setLoading(true);

			const backendUrl = import.meta.env.VITE_BACKEND_URL;

			const response = await fetch(
				`${backendUrl}/api/cart/items`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						product_id: product.id,
						quantity: 1,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setError(
					data.message ||
					"No se pudo añadir el producto al carrito."
				);
				return;
			}

			setMessage("Producto añadido al carrito.");

			window.dispatchEvent(
				new CustomEvent("cart-change", {
					detail: data.cart,
				})
			);

		} catch (error) {
			console.error("Error al añadir al carrito:", error);

			setError("No se pudo conectar con el servidor.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card h-100 border-0 shadow-sm">
			<img
				src={imageUrl}
				className="card-img-top"
				alt={product.name}
				style={{
					height: "220px",
					objectFit: "cover",
				}}
			/>

			<div className="card-body d-flex flex-column p-4">
				{product.category && (
					<span className="badge text-bg-light align-self-start mb-2">
						{product.category.name}
					</span>
				)}

				<h2 className="h5 fw-bold">
					{product.name}
				</h2>

				<p className="text-secondary flex-grow-1">
					{product.description}
				</p>

				<div className="d-flex justify-content-between align-items-center mb-3">
					<span className="fs-5 fw-bold text-primary">
						{Number(product.price).toFixed(2)} €
					</span>

					<span
						className={
							product.stock > 0
								? "text-success"
								: "text-danger"
						}
					>
						{product.stock > 0
							? `Stock: ${product.stock}`
							: "Sin stock"}
					</span>
				</div>

				{error && (
					<div className="alert alert-danger py-2">
						{error}
					</div>
				)}

				{message && (
					<div className="alert alert-success py-2">
						{message}
					</div>
				)}

				<div className="d-grid gap-2">
					<Link
						to={`/products/${product.id}`}
						className="btn btn-outline-dark"
					>
						Ver detalle
					</Link>

					<button
						type="button"
						className="btn btn-primary"
						onClick={handleAddToCart}
						disabled={loading || product.stock <= 0}
					>
						{loading
							? "Añadiendo..."
							: product.stock > 0
								? "Añadir al carrito"
								: "Sin stock"}
					</button>
				</div>
			</div>
		</div>
	);
};