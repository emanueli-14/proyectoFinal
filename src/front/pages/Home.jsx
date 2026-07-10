import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<main>
			<section className="py-5 bg-light">
				<div className="container">
					<div className="row align-items-center min-vh-50">
						<div className="col-12 col-lg-6 mb-4 mb-lg-0">
							<p className="text-uppercase fw-semibold text-primary mb-2">
								Tu tienda online
							</p>

							<h1 className="display-4 fw-bold mb-3">
								Encuentra productos para tu día a día
							</h1>

							<p className="lead text-secondary mb-4">
								Descubre nuestro catálogo, consulta los detalles de cada
								producto y compra de forma sencilla y segura.
							</p>

							<div className="d-flex flex-wrap gap-3">
								<Link to="/products" className="btn btn-primary btn-lg">
									Ver productos
								</Link>

								<Link to="/register" className="btn btn-outline-dark btn-lg">
									Crear cuenta
								</Link>
							</div>
						</div>

						<div className="col-12 col-lg-6">
							<div className="bg-white rounded-4 shadow-sm p-5 text-center">
								<div className="display-1 mb-3">🛍️</div>

								<h2 className="h3 fw-bold">
									Compra fácil y rápido
								</h2>

								<p className="text-secondary mb-0">
									Productos, carrito, perfil de usuario y pagos en una sola
									aplicación.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-5">
				<div className="container">
					<div className="text-center mb-5">
						<h2 className="fw-bold">¿Qué encontrarás en nuestra tienda?</h2>

						<p className="text-secondary">
							Una experiencia sencilla para descubrir y comprar productos.
						</p>
					</div>

					<div className="row g-4">
						<div className="col-12 col-md-4">
							<div className="card h-100 border-0 shadow-sm">
								<div className="card-body p-4 text-center">
									<div className="fs-1 mb-3">📦</div>
									<h3 className="h5 fw-bold">Catálogo completo</h3>
									<p className="text-secondary mb-0">
										Explora todos los productos disponibles y sus categorías.
									</p>
								</div>
							</div>
						</div>

						<div className="col-12 col-md-4">
							<div className="card h-100 border-0 shadow-sm">
								<div className="card-body p-4 text-center">
									<div className="fs-1 mb-3">🛒</div>
									<h3 className="h5 fw-bold">Carrito conectado</h3>
									<p className="text-secondary mb-0">
										Guarda productos, cambia cantidades y revisa el total.
									</p>
								</div>
							</div>
						</div>

						<div className="col-12 col-md-4">
							<div className="card h-100 border-0 shadow-sm">
								<div className="card-body p-4 text-center">
									<div className="fs-1 mb-3">🔒</div>
									<h3 className="h5 fw-bold">Compra segura</h3>
									<p className="text-secondary mb-0">
										Registro, login y acceso protegido mediante JWT.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};