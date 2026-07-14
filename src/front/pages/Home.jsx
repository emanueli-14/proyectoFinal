import { Link } from "react-router-dom";

export const Home = () => {
	return (
		<>
			{/* HERO */}
			<section
				className="bg-dark text-white d-flex align-items-center"
				style={{ minHeight: "85vh" }}
			>
				<div className="container">
					<div className="row align-items-center">

						<div className="col-lg-6">

							<h5 className="text-uppercase text-info mb-3">
								Bienvenido a
							</h5>


							<h1
								className="display-2 fw-bold"
								style={{ letterSpacing: "3px" }}
							>
								VIMILEA
							</h1>

							<p className="lead mt-4">
								Tecnología para tu día a día.
							</p>

							<p className="text-light mb-5">
								Descubre dispositivos tecnológicos cuidadosamente
								seleccionados para ofrecerte calidad, innovación
								y una experiencia de compra rápida y segura.
							</p>

							<Link
								to="/products"
								className="btn btn-light btn-lg px-5"
							>
								Comprar ahora
							</Link>

						</div>

						<div className="col-lg-6 text-center">

							<img

								src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200"
								className="img-fluid rounded-4 shadow-lg"
								alt="Tecnología VIMILEA"
							/>


						</div>

					</div>
				</div>
			</section >

			{/* BENEFICIOS */}

			< section className="py-5" >

				<div className="container">

					<div className="row text-center">

						<div className="col-md-4">

							<h2>💻</h2>

							<h4>Tecnología de última generación</h4>

							<p>
								Equipos modernos seleccionados para ofrecer el mejor rendimiento.
							</p>

						</div>

						<div className="col-md-4">

							<h2>🔒</h2>

							<h4>Pago seguro</h4>

							<p>
								Todas las compras están protegidas mediante Stripe.
							</p>

						</div>

						<div className="col-md-4">

							<h2>🚚</h2>

							<h4>Envío rápido</h4>

							<p>
								Recibe tus productos de forma rápida y segura.
							</p>

						</div>

					</div>

				</div>

			</section >

			{/* CTA */}

			< section className="bg-light py-5" >

				<div className="container text-center">

					<h2 className="fw-bold mb-4">
						Empieza a comprar hoy mismo
					</h2>

					<p className="mb-4">
						Explora nuestro catálogo y encuentra productos únicos
						con la mejor experiencia de compra.
					</p>

					<Link
						to="/products"
						className="btn btn-dark btn-lg"
					>
						Ver catálogo
					</Link>

				</div>

			</section >
		</>
	);
};