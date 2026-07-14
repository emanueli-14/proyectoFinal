import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		password: "",
		phone: "",
		address: "",
	});

	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		setMessage("");
		setError("");

		if (
			!formData.first_name.trim() ||
			!formData.last_name.trim() ||
			!formData.email.trim() ||
			!formData.password
		) {
			setError("Completa todos los campos obligatorios.");
			return;
		}

		if (formData.password.length < 6) {
			setError("La contraseña debe tener al menos 6 caracteres.");
			return;
		}

		try {
			setLoading(true);

			const backendUrl = import.meta.env.VITE_BACKEND_URL;

			const response = await fetch(
				`${backendUrl}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				setError(data.message || "No se pudo crear la cuenta.");
				return;
			}

			setMessage(data.message);

			setFormData({
				first_name: "",
				last_name: "",
				email: "",
				password: "",
				phone: "",
				address: "",
			});

			setTimeout(() => {
				navigate("/login");
			}, 1500);

		} catch (error) {
			console.error("Error al registrar:", error);
			setError("No se pudo conectar con el servidor.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="py-5 bg-light">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-12 col-md-10 col-lg-7">
						<div className="card border-0 shadow-sm">
							<div className="card-body p-4 p-md-5">
								<div className="text-center mb-4">
									<h1 className="fw-bold">Crear cuenta</h1>

									<p className="text-secondary mb-0">
										Regístrate para guardar tu carrito y realizar compras.
									</p>
								</div>

								{error && (
									<div className="alert alert-danger">
										{error}
									</div>
								)}

								{message && (
									<div className="alert alert-success">
										{message}
									</div>
								)}

								<form onSubmit={handleSubmit}>
									<div className="row g-3">
										<div className="col-12 col-md-6">
											<label
												htmlFor="first_name"
												className="form-label"
											>
												Nombre *
											</label>

											<input
												type="text"
												id="first_name"
												name="first_name"
												className="form-control"
												value={formData.first_name}
												onChange={handleChange}
												placeholder="Nombre..."
												required
											/>
										</div>

										<div className="col-12 col-md-6">
											<label
												htmlFor="last_name"
												className="form-label"
											>
												Apellido *
											</label>

											<input
												type="text"
												id="last_name"
												name="last_name"
												className="form-control"
												value={formData.last_name}
												onChange={handleChange}
												placeholder="Apellido"
												required
											/>
										</div>

										<div className="col-12">
											<label
												htmlFor="email"
												className="form-label"
											>
												Correo electrónico *
											</label>

											<input
												type="email"
												id="email"
												name="email"
												className="form-control"
												value={formData.email}
												onChange={handleChange}
												placeholder="correo@ejemplo.com"
												required
											/>
										</div>

										<div className="col-12">
											<label
												htmlFor="password"
												className="form-label"
											>
												Contraseña *
											</label>

											<input
												type="password"
												id="password"
												name="password"
												className="form-control"
												value={formData.password}
												onChange={handleChange}
												placeholder="Mínimo 6 caracteres"
												minLength="6"
												required
											/>
										</div>

										<div className="col-12 col-md-6">
											<label
												htmlFor="phone"
												className="form-label"
											>
												Teléfono
											</label>

											<input
												type="tel"
												id="phone"
												name="phone"
												className="form-control"
												value={formData.phone}
												onChange={handleChange}
												placeholder="Telefono"
											/>
										</div>

										<div className="col-12 col-md-6">
											<label
												htmlFor="address"
												className="form-label"
											>
												Dirección
											</label>

											<input
												type="text"
												id="address"
												name="address"
												className="form-control"
												value={formData.address}
												onChange={handleChange}
												placeholder="Ciudad..."
											/>
										</div>

										<div className="col-12 mt-4">
											<button
												type="submit"
												className="btn btn-primary w-100 py-2"
												disabled={loading}
											>
												{loading
													? "Creando cuenta..."
													: "Crear cuenta"}
											</button>
										</div>
									</div>
								</form>

								<p className="text-center mt-4 mb-0">
									¿Ya tienes una cuenta?{" "}
									<Link to="/login">
										Inicia sesión
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};