import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();

	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("user");

		return savedUser
			? JSON.parse(savedUser)
			: null;
	});

	const updateUser = () => {
		const savedUser = localStorage.getItem("user");

		setUser(
			savedUser
				? JSON.parse(savedUser)
				: null
		);
	};

	useEffect(() => {
		window.addEventListener("auth-change", updateUser);
		window.addEventListener("storage", updateUser);

		return () => {
			window.removeEventListener(
				"auth-change",
				updateUser
			);

			window.removeEventListener(
				"storage",
				updateUser
			);
		};
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");

		setUser(null);

		window.dispatchEvent(
			new Event("auth-change")
		);

		navigate("/login");
	};

	const navLinkClass = ({ isActive }) => {
		return `nav-link ${isActive
				? "active fw-semibold"
				: ""
			}`;
	};

	return (
		<nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
			<div className="container">
				<Link
					className="navbar-brand fw-bold"
					to="/"
				>
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

				<div
					className="collapse navbar-collapse"
					id="mainNavbar"
				>
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink
								to="/"
								end
								className={navLinkClass}
							>
								Inicio
							</NavLink>
						</li>

						<li className="nav-item">
							<NavLink
								to="/products"
								className={navLinkClass}
							>
								Productos
							</NavLink>
						</li>

						{user && (
							<>
								<li className="nav-item">
									<NavLink
										to="/cart"
										className={navLinkClass}
									>
										Carrito
									</NavLink>
								</li>

								<li className="nav-item">
									<NavLink
										to="/profile"
										className={navLinkClass}
									>
										Perfil
									</NavLink>
								</li>
							</>
						)}
					</ul>

					{user ? (
						<div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
							<span className="navbar-text text-light me-lg-2">
								Hola, {user.first_name}
							</span>

							<button
								type="button"
								className="btn btn-outline-light"
								onClick={handleLogout}
							>
								Cerrar sesión
							</button>
						</div>
					) : (
						<div className="d-flex gap-2">
							<Link
								to="/login"
								className="btn btn-outline-light"
							>
								Iniciar sesión
							</Link>

							<Link
								to="/register"
								className="btn btn-primary"
							>
								Registrarse
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};