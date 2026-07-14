import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ProductCard = ({ product }) => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const imageUrl =
		product.image_url ||
		"https://via.placeholder.com/600x500?text=VIMILEA";

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

			setMessage("Producto añadido al carrito");

			window.dispatchEvent(
				new CustomEvent("cart-change", {
					detail: data.cart,
				})
			);
		} catch (error) {
			console.error(
				"Error al añadir el producto:",
				error
			);

			setError("No se pudo conectar con el servidor.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<article className="card h-100 border-0 shadow-sm overflow-hidden product-card">
			<div
				className="position-relative bg-light"
				style={{ minHeight: "300px" }}
			>
				<img
					src={imageUrl}
					className="card-img-top"
					alt={product.name}
					style={{
						width: "100%",
						height: "300px",
						objectFit: "cover",
					}}
				/>

				{product.category && (
					<span className="position-absolute top-0 start-0 badge bg-white text-dark m-3 px-3 py-2 shadow-sm">
						{product.category.name}
					</span>
				)}

				{product.stock <= 0 && (
					<div className="position-absolute top-0 end-0 m-3">
						<span className="badge bg-danger px-3 py-2">
							Agotado
						</span>
					</div>
				)}
			</div>

			<div className="card-body d-flex flex-column p-4">
				<p
					className="text-uppercase text-secondary small mb-2"
					style={{ letterSpacing: "0.08rem" }}
				>
					VIMILEA Selection
				</p>

				<h2 className="h5 fw-bold text-dark mb-3">
					{product.name}
				</h2>

				<p className="text-secondary flex-grow-1">
					{product.description}
				</p>

				<div className="d-flex justify-content-between align-items-center mt-3 mb-4">
					<span className="h4 fw-bold mb-0">
						{Number(product.price).toFixed(2)} €
					</span>

					<span
						className={
							product.stock > 0
								? "small text-success"
								: "small text-danger"
						}
					>
						{product.stock > 0
							? `${product.stock} disponibles`
							: "Sin stock"}
					</span>
				</div>

				{error && (
					<div className="alert alert-danger py-2 small">
						{error}
					</div>
				)}

				{message && (
					<div className="alert alert-success py-2 small">
						{message}
					</div>
				)}

				<div className="d-grid">


					<button
						type="button"
						className="btn btn-dark"
						onClick={handleAddToCart}
						disabled={
							loading ||
							product.stock <= 0
						}
					>
						{loading
							? "Añadiendo..."
							: product.stock > 0
								? "Añadir al carrito"
								: "Producto agotado"}
					</button>
				</div>
			</div>
		</article>
	);
};