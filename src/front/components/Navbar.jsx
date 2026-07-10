import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
			<div className="container">
				<Link className="navbar-brand fw-bold" to="/">
					🛍️ Mi Tienda
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#mainNavbar"
					aria-controls="mainNavbar"
					aria-expanded="false"
					aria-label="Abrir navegación"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="mainNavbar">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink
								to="/"
								end
								className={({ isActive }) =>
									`nav-link ${isActive ? "active fw-semibold" : ""}`
								}
							>
								Inicio
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to="/products"
								className={({ isActive }) =>
									`nav-link ${isActive ? "active fw-semibold" : ""}`
								}
							>
								Productos
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to="/cart"
								className={({ isActive }) =>
									`nav-link ${isActive ? "active fw-semibold" : ""}`
								}
							>
								Carrito
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to="/profile"
								className={({ isActive }) =>
									`nav-link ${isActive ? "active fw-semibold" : ""}`
								}
							>
								Perfil
							</NavLink>
						</li>
					</ul>

					<div className="d-flex gap-2">
						<Link to="/login" className="btn btn-outline-light">
							Iniciar sesión
						</Link>

						<Link to="/register" className="btn btn-primary">
							Registrarse
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};