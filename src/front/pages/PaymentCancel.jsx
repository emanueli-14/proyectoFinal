import { Link } from "react-router-dom";

export const PaymentCancel = () => {
	return (
		<main className="py-5 bg-light">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12 col-md-8 col-lg-6">
						<div className="card border-0 shadow-sm">
							<div className="card-body text-center p-5">
								<div className="display-1 mb-3">
									⚠️
								</div>

								<h1 className="fw-bold text-warning">
									Pago cancelado
								</h1>

								<p className="text-secondary mt-3">
									El pago no se ha completado. Tu pedido
									continúa pendiente y puedes intentarlo
									nuevamente cuando quieras.
								</p>

								<div className="d-grid gap-2 mt-4">
									<Link
										to="/orders"
										className="btn btn-primary"
									>
										Volver a mis pedidos
									</Link>

									<Link
										to="/products"
										className="btn btn-outline-dark"
									>
										Seguir comprando
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};