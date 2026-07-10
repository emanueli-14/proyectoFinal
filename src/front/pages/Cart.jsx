import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Cart = () => {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const notifyCartChange = (updatedCart) => {
        window.dispatchEvent(
            new CustomEvent("cart-change", {
                detail: updatedCart,
            })
        );
    };

    const loadCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

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
                    "No se pudo cargar el carrito."
                );
                return;
            }

            setCart(data.cart);
            notifyCartChange(data.cart);

        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (quantity < 1) {
            return;
        }

        try {
            setUpdatingItemId(itemId);
            setError("");
            setMessage("");

            const response = await fetch(
                `${backendUrl}/api/cart/items/${itemId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        quantity: quantity,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "No se pudo actualizar la cantidad."
                );
                return;
            }

            setCart(data.cart);
            setMessage(data.message || "Cantidad actualizada.");
            notifyCartChange(data.cart);

        } catch (error) {
            console.error(
                "Error al actualizar la cantidad:",
                error
            );

            setError("No se pudo conectar con el servidor.");
        } finally {
            setUpdatingItemId(null);
        }
    };

    const removeItem = async (itemId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setUpdatingItemId(itemId);
            setError("");
            setMessage("");

            const response = await fetch(
                `${backendUrl}/api/cart/items/${itemId}`,
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
                    "No se pudo eliminar el producto."
                );
                return;
            }

            setCart(data.cart);
            setMessage(
                data.message ||
                "Producto eliminado del carrito."
            );

            notifyCartChange(data.cart);

        } catch (error) {
            console.error(
                "Error al eliminar el producto:",
                error
            );

            setError("No se pudo conectar con el servidor.");
        } finally {
            setUpdatingItemId(null);
        }
    };

    const clearCart = async () => {
        const confirmation = window.confirm(
            "¿Quieres vaciar todo el carrito?"
        );

        if (!confirmation) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await fetch(
                `${backendUrl}/api/cart/clear`,
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
                    "No se pudo vaciar el carrito."
                );
                return;
            }

            setCart(data.cart);
            setMessage(
                data.message ||
                "Carrito vaciado correctamente."
            );

            notifyCartChange(data.cart);

        } catch (error) {
            console.error(
                "Error al vaciar el carrito:",
                error
            );

            setError("No se pudo conectar con el servidor.");
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

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
                    Cargando carrito...
                </p>
            </main>
        );
    }

    if (!cart) {
        return (
            <main className="container py-5">
                <div className="alert alert-danger">
                    No se pudo cargar el carrito.
                </div>
            </main>
        );
    }

    return (
        <main className="py-5 bg-light">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <h1 className="fw-bold mb-1">
                            Mi carrito
                        </h1>

                        <p className="text-secondary mb-0">
                            Revisa tus productos antes de finalizar la compra.
                        </p>
                    </div>

                    {cart.items.length > 0 && (
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={clearCart}
                        >
                            Vaciar carrito
                        </button>
                    )}
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

                {cart.items.length === 0 ? (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center p-5">
                            <div className="display-3 mb-3">
                                🛒
                            </div>

                            <h2 className="h4 fw-bold">
                                Tu carrito está vacío
                            </h2>

                            <p className="text-secondary">
                                Explora el catálogo y añade algún producto.
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
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            {cart.items.map((item) => {
                                const imageUrl =
                                    item.product.image_url ||
                                    "https://via.placeholder.com/300x200?text=Producto";

                                const isUpdating =
                                    updatingItemId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        className="card border-0 shadow-sm mb-3"
                                    >
                                        <div className="card-body p-3 p-md-4">
                                            <div className="row align-items-center g-3">
                                                <div className="col-12 col-md-3">
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.product.name}
                                                        className="img-fluid rounded"
                                                        style={{
                                                            width: "100%",
                                                            height: "140px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>

                                                <div className="col-12 col-md-9">
                                                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                                                        <div>
                                                            <h2 className="h5 fw-bold mb-2">
                                                                {item.product.name}
                                                            </h2>

                                                            <p className="text-secondary mb-2">
                                                                {item.product.description}
                                                            </p>

                                                            <p className="mb-2">
                                                                Precio unitario:{" "}
                                                                <span className="fw-semibold">
                                                                    {Number(
                                                                        item.product.price
                                                                    ).toFixed(2)}{" "}
                                                                    €
                                                                </span>
                                                            </p>

                                                            <p className="mb-0">
                                                                Subtotal:{" "}
                                                                <span className="fw-bold text-primary">
                                                                    {Number(
                                                                        item.subtotal
                                                                    ).toFixed(2)}{" "}
                                                                    €
                                                                </span>
                                                            </p>
                                                        </div>

                                                        <div className="d-flex flex-column align-items-md-end gap-3">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    disabled={
                                                                        isUpdating ||
                                                                        item.quantity <= 1
                                                                    }
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            item.quantity - 1
                                                                        )
                                                                    }
                                                                >
                                                                    −
                                                                </button>

                                                                <span className="fw-bold px-2">
                                                                    {item.quantity}
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary btn-sm"
                                                                    disabled={
                                                                        isUpdating ||
                                                                        item.quantity >=
                                                                        item.product.stock
                                                                    }
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.id,
                                                                            item.quantity + 1
                                                                        )
                                                                    }
                                                                >
                                                                    +
                                                                </button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-danger btn-sm"
                                                                disabled={isUpdating}
                                                                onClick={() =>
                                                                    removeItem(item.id)
                                                                }
                                                            >
                                                                {isUpdating
                                                                    ? "Actualizando..."
                                                                    : "Eliminar"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm sticky-lg-top">
                                <div className="card-body p-4">
                                    <h2 className="h4 fw-bold mb-4">
                                        Resumen
                                    </h2>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Productos</span>

                                        <span>
                                            {cart.total_quantity}
                                        </span>
                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="h5 mb-0">
                                            Total
                                        </span>

                                        <span className="h4 fw-bold text-primary mb-0">
                                            {Number(cart.total).toFixed(2)} €
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-primary w-100 py-2"
                                    >
                                        Finalizar compra
                                    </button>

                                    <Link
                                        to="/products"
                                        className="btn btn-outline-dark w-100 mt-2"
                                    >
                                        Seguir comprando
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};