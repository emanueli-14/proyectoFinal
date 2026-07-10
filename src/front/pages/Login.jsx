import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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

        setError("");

        if (!formData.email.trim() || !formData.password) {
            setError("Completa el correo y la contraseña.");
            return;
        }

        try {
            setLoading(true);

            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const response = await fetch(
                `${backendUrl}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "No se pudo iniciar sesión.");
                return;
            }

            localStorage.setItem(
                "token",
                data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            window.dispatchEvent(
                new Event("auth-change")
            );

            navigate("/profile");

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="py-5 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-5">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h1 className="fw-bold">Iniciar sesión</h1>

                                    <p className="text-secondary mb-0">
                                        Accede a tu cuenta para continuar.
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Correo electrónico
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

                                    <div className="mb-3">
                                        <label
                                            htmlFor="password"
                                            className="form-label"
                                        >
                                            Contraseña
                                        </label>

                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Tu contraseña"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 mt-2"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Iniciando sesión..."
                                            : "Iniciar sesión"}
                                    </button>
                                </form>

                                <p className="text-center mt-4 mb-0">
                                    ¿Todavía no tienes cuenta?{" "}
                                    <Link to="/register">
                                        Regístrate
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