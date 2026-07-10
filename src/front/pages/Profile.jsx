import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // ======================================
    // OBTENER PERFIL
    // ======================================

    const loadProfile = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${backendUrl}/api/auth/profile`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setError(
                    data.message ||
                    "No se pudo obtener el perfil."
                );

                navigate("/login");
                return;
            }

            setUser(data.user);

            setFormData({
                first_name: data.user.first_name || "",
                last_name: data.user.last_name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                address: data.user.address || "",
                password: "",
            });

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

        } catch (error) {
            console.error("Error al cargar el perfil:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // ======================================
    // CAMBIAR CAMPOS
    // ======================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // ======================================
    // EDITAR PERFIL
    // ======================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("token");

        setError("");
        setMessage("");

        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim() ||
            !formData.email.trim()
        ) {
            setError(
                "Nombre, apellido y correo son obligatorios."
            );
            return;
        }

        if (
            formData.password &&
            formData.password.length < 6
        ) {
            setError(
                "La nueva contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        const dataToSend = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
        };

        if (formData.password) {
            dataToSend.password = formData.password;
        }

        try {
            setSaving(true);

            const response = await fetch(
                `${backendUrl}/api/auth/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(dataToSend),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "No se pudo actualizar el perfil."
                );
                return;
            }

            setUser(data.user);

            setFormData({
                first_name: data.user.first_name || "",
                last_name: data.user.last_name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                address: data.user.address || "",
                password: "",
            });

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage(data.message);
            setEditing(false);

        } catch (error) {
            console.error("Error al editar el perfil:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setSaving(false);
        }
    };

    // ======================================
    // CANCELAR EDICIÓN
    // ======================================

    const cancelEditing = () => {
        setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
            password: "",
        });

        setError("");
        setMessage("");
        setEditing(false);
    };

    // ======================================
    // CERRAR SESIÓN
    // ======================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(
            new Event("auth-change")
        );

        navigate("/login");
    };

    // ======================================
    // ELIMINAR CUENTA
    // ======================================

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            "¿Estás segura de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
        );

        if (!confirmation) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${backendUrl}/api/auth/profile`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "No se pudo eliminar la cuenta."
                );
                return;
            }

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.dispatchEvent(
                new Event("auth-change")
            );

            navigate("/register");

        } catch (error) {
            console.error(
                "Error al eliminar la cuenta:",
                error
            );

            setError("No se pudo conectar con el servidor.");
        }
    };

    // ======================================
    // CARGANDO
    // ======================================

    if (loading) {
        return (
            <main className="container py-5 text-center">
                <div
                    className="spinner-border text-primary"
                    role="status"
                >
                    <span className="visually-hidden">
                        Cargando...
                    </span>
                </div>

                <p className="mt-3">
                    Cargando perfil...
                </p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="container py-5">
                <div className="alert alert-danger">
                    No se pudo cargar el usuario.
                </div>
            </main>
        );
    }

    return (
        <main className="py-5 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-8">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">

                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                                    <div>
                                        <h1 className="fw-bold mb-1">
                                            Mi perfil
                                        </h1>

                                        <p className="text-secondary mb-0">
                                            Consulta y modifica los datos de tu cuenta.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                    >
                                        Cerrar sesión
                                    </button>
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

                                {!editing ? (
                                    <>
                                        <div className="row g-4">
                                            <div className="col-12 col-md-6">
                                                <p className="text-secondary mb-1">
                                                    Nombre
                                                </p>

                                                <p className="fw-semibold">
                                                    {user.first_name}
                                                </p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-secondary mb-1">
                                                    Apellido
                                                </p>

                                                <p className="fw-semibold">
                                                    {user.last_name}
                                                </p>
                                            </div>

                                            <div className="col-12">
                                                <p className="text-secondary mb-1">
                                                    Correo electrónico
                                                </p>

                                                <p className="fw-semibold">
                                                    {user.email}
                                                </p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-secondary mb-1">
                                                    Teléfono
                                                </p>

                                                <p className="fw-semibold">
                                                    {user.phone || "No indicado"}
                                                </p>
                                            </div>

                                            <div className="col-12 col-md-6">
                                                <p className="text-secondary mb-1">
                                                    Dirección
                                                </p>

                                                <p className="fw-semibold">
                                                    {user.address || "No indicada"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap gap-3 mt-4">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setError("");
                                                    setMessage("");
                                                    setEditing(true);
                                                }}
                                            >
                                                Editar perfil
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={handleDeleteAccount}
                                            >
                                                Eliminar cuenta
                                            </button>
                                        </div>
                                    </>
                                ) : (
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
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    htmlFor="password"
                                                    className="form-label"
                                                >
                                                    Nueva contraseña
                                                </label>

                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="form-control"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Déjalo vacío para mantener la contraseña actual"
                                                />

                                                <div className="form-text">
                                                    Solo completa este campo si quieres cambiarla.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap gap-3 mt-4">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={saving}
                                            >
                                                {saving
                                                    ? "Guardando..."
                                                    : "Guardar cambios"}
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={cancelEditing}
                                                disabled={saving}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};