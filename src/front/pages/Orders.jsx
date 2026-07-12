import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [payingOrderId, setPayingOrderId] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // ======================================
    // CARGAR PEDIDOS
    // ======================================

    const loadOrders = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${backendUrl}/api/orders/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    window.dispatchEvent(
                        new Event("auth-change")
                    );

                    navigate("/login");
                    return;
                }

                setError(
                    data.message ||
                    "No se pudieron cargar los pedidos."
                );

                return;
            }

            setOrders(data.orders || []);

        } catch (error) {
            console.error(
                "Error al cargar los pedidos:",
                error
            );

            setError(
                "No se pudo conectar con el servidor."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================
    // PAGAR PEDIDO CON STRIPE
    // ======================================

    const handlePayOrder = async (orderId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setPayingOrderId(orderId);
            setError("");

            const response = await fetch(
                `${backendUrl}/api/payments/create-checkout-session/${orderId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "No se pudo iniciar el pago."
                );

                return;
            }

            if (!data.checkout_url) {
                setError(
                    "Stripe no devolvió una dirección de pago."
                );

                return;
            }

            window.location.href = data.checkout_url;

        } catch (error) {
            console.error(
                "Error al iniciar el pago:",
                error
            );

            setError(
                "No se pudo conectar con el servidor."
            );
        } finally {
            setPayingOrderId(null);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

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

                <p className="mt-3 mb-0">
                    Cargando pedidos...
                </p>
            </main>
        );
    }

    return (
        <main className="py-5 bg-light">
            <div className="container">
                <div className="mb-4">
                    <h1 className="fw-bold mb-1">
                        Mis pedidos
                    </h1>

                    <p className="text-secondary mb-0">
                        Consulta el historial de tus compras y paga
                        los pedidos pendientes.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-5">
                            <div className="display-3 mb-3">
                                📦
                            </div>

                            <h2 className="h4 fw-bold">
                                Todavía no tienes pedidos
                            </h2>

                            <p className="text-secondary">
                                Cuando finalices una compra,
                                aparecerá aquí.
                            </p>

                            <Link
                                to="/products"
                                className="btn btn-primary"
                            >
                                Ver productos
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="d-grid gap-4">
                        {orders.map((order) => {
                            const isPending =
                                order.status === "pending";

                            const isPaid =
                                order.status === "paid";

                            return (
                                <div
                                    key={order.id}
                                    className="card border-0 shadow-sm"
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                                            <div>
                                                <h2 className="h5 fw-bold mb-1">
                                                    Pedido #{order.id}
                                                </h2>

                                                <p className="text-secondary mb-0">
                                                    {order.created_at
                                                        ? new Date(
                                                            order.created_at
                                                        ).toLocaleString(
                                                            "es-ES"
                                                        )
                                                        : "Fecha no disponible"}
                                                </p>
                                            </div>

                                            <div className="text-md-end">
                                                <span
                                                    className={
                                                        isPaid
                                                            ? "badge text-bg-success mb-2"
                                                            : "badge text-bg-warning mb-2"
                                                    }
                                                >
                                                    {isPaid
                                                        ? "Pagado"
                                                        : order.status}
                                                </span>

                                                <p className="h5 fw-bold text-primary mb-0">
                                                    {Number(
                                                        order.total
                                                    ).toFixed(2)}{" "}
                                                    €
                                                </p>

                                                {isPending && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary mt-3"
                                                        onClick={() =>
                                                            handlePayOrder(
                                                                order.id
                                                            )
                                                        }
                                                        disabled={
                                                            payingOrderId ===
                                                            order.id
                                                        }
                                                    >
                                                        {payingOrderId ===
                                                            order.id
                                                            ? "Abriendo Stripe..."
                                                            : "Pagar ahora"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="d-grid gap-3">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="border rounded p-3"
                                                >
                                                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                                        <div>
                                                            <h3 className="h6 fw-bold mb-1">
                                                                {item.product
                                                                    ?.name ||
                                                                    "Producto no disponible"}
                                                            </h3>

                                                            <p className="text-secondary mb-0">
                                                                Cantidad:{" "}
                                                                {item.quantity}
                                                            </p>
                                                        </div>

                                                        <div className="text-md-end">
                                                            <p className="mb-1">
                                                                Precio:{" "}
                                                                {Number(
                                                                    item.price
                                                                ).toFixed(2)}{" "}
                                                                €
                                                            </p>

                                                            <p className="fw-semibold mb-0">
                                                                Subtotal:{" "}
                                                                {Number(
                                                                    item.subtotal
                                                                ).toFixed(2)}{" "}
                                                                €
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};