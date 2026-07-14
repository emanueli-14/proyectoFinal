import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";



export const Navbar = () => {
	const navigate = useNavigate();

	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem("user");

		try {
			return savedUser ? JSON.parse(savedUser) : null;
		} catch {
			return null;
		}
	});

	const [cartQuantity, setCartQuantity] = useState(0);

	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	const loadCartQuantity = async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			setCartQuantity(0);
			return;
		}

		try {
			const response = await fetch(
				`${backendUrl}/api/cart/`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setCartQuantity(0);
				return;
			}

			setCartQuantity(
				data.cart?.total_quantity || 0
			);
		} catch (error) {
			console.error(
				"Error al cargar el contador del carrito:",
				error
			);

			setCartQuantity(0);
		}
	};

	const updateUser = () => {
		const savedUser = localStorage.getItem("user");

		try {
			const parsedUser = savedUser
				? JSON.parse(savedUser)
				: null;

			setUser(parsedUser);

			if (parsedUser) {
				loadCartQuantity();
			} else {
				setCartQuantity(0);
			}
		} catch {
			setUser(null);
			setCartQuantity(0);
		}
	};

	const updateCartQuantity = (event) => {
		const updatedCart = event.detail;

		if (updatedCart) {
			setCartQuantity(
				updatedCart.total_quantity || 0
			);
		} else {
			loadCartQuantity();
		}
	};

	useEffect(() => {
		updateUser();

		window.addEventListener(
			"auth-change",
			updateUser
		);

		window.addEventListener(
			"cart-change",
			updateCartQuantity
		);

		window.addEventListener(
			"storage",
			updateUser
		);

		return () => {
			window.removeEventListener(
				"auth-change",
				updateUser
			);

			window.removeEventListener(
				"cart-change",
				updateCartQuantity
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
		setCartQuantity(0);

		window.dispatchEvent(
			new Event("auth-change")
		);

		navigate("/login");
	};

	const navLinkClass = ({ isActive }) => {
		return `nav-link px-3 ${isActive
			? "active fw-semibold text-dark"
			: "text-secondary"
			}`;
	};

	return (
		<nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
			<div className="container py-2">
				<Link
					className="navbar-brand d-flex flex-column lh-1"
					to="/"
				>
					<span
						className="fw-bold text-dark"
						style={{
							letterSpacing: "0.18rem",
							fontSize: "1.8rem"
						}}
					>
						VIMILEA
					</span>


					<small
						className="text-secondary"
						style={{
							fontSize: "0.65rem",
							letterSpacing: "0.08rem",
						}}
					>
						TECH STORE
					</small>
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
					<ul className="navbar-nav mx-auto mb-2 mb-lg-0">
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
								Tienda
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

										<span className="badge rounded-pill bg-dark ms-2">
											{cartQuantity}
										</span>
									</NavLink>
								</li>

								<li className="nav-item">
									<NavLink
										to="/orders"
										className={navLinkClass}
									>
										Pedidos
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
							<span className="text-secondary small me-lg-2">
								Hola, {user.first_name}
							</span>

							<button
								type="button"
								className="btn btn-dark"
								onClick={handleLogout}
							>
								Cerrar sesión
							</button>
						</div>
					) : (
						<div className="d-flex gap-2">
							<Link
								to="/login"
								className="btn btn-outline-dark"
							>
								Iniciar sesión
							</Link>

							<Link
								to="/register"
								className="btn btn-dark"
							>
								Crear cuenta
							</Link>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};