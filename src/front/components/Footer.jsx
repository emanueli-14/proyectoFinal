export const Footer = () => {
	return (
		<footer className="bg-dark text-white py-5 mt-5">
			<div className="container">

				<div className="row">

					<div className="col-md-4 mb-4">

						<h3 className="fw-bold">
							VIMILEA
						</h3>

						<p className="text-light">
							Your Style, Your Choice.
						</p>

					</div>

					<div className="col-md-4 mb-4">

						<h5>Información</h5>

						<ul className="list-unstyled">

							<li>Inicio</li>
							<li>Productos</li>
							<li>Mi perfil</li>
							<li>Mis pedidos</li>

						</ul>

					</div>

					<div className="col-md-4">

						<h5>Contacto</h5>

						<p>
							📧 info@vimilea.com
						</p>

						<p>
							📍 España
						</p>

						<p>
							🔒 Pagos seguros con Stripe
						</p>

					</div>

				</div>

				<hr />

				<p className="text-center mb-0">
					© {new Date().getFullYear()} VIMILEA · Todos los derechos reservados.
				</p>

			</div>
		</footer>
	);
};