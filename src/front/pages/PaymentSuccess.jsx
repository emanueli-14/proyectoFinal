import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => {
            clearTimeout(timer);
        };
    }, [navigate]);

    if (loading) {
        return (
            <main className="container py-5 text-center">
                <div
                    className="spinner-border text-success"
                    role="status"
                >
                    <span className="visually-hidden">
                        Confirmando pago...
                    </span>
                </div>

                <h1 className="h4 mt-4">
                    Confirmando tu pago
                </h1>

                <p className="text-secondary mb-0">
                    Estamos verificando la información con Stripe.
                </p>
            </main>
        );
    }

    return (
        <main className="py-5 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-9 col-lg-7">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center">
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success-subtle mb-4"
                                        style={{
                                            width: "90px",
                                            height: "90px",
                                        }}
                                    >
                                        <span className="display-5">
                                            ✅
                                        </span>
                                    </div>

                                    <h1 className="fw-bold text-success mb-3">
                                        Pago realizado correctamente
                                    </h1>

                                    <p className="lead text-secondary">
                                        Gracias por tu compra. Stripe ha procesado
                                        el pago y tu pedido ha sido confirmado.
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-4">
                                        {error}
                                    </div>
                                )}

                                <div className="border rounded-3 bg-light p-4 my-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-secondary">
                                            Estado
                                        </span>

                                        <span className="badge text-bg-success">
                                            Pagado
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-secondary">
                                            Confirmación
                                        </span>

                                        <span className="fw-semibold">
                                            Pago aceptado
                                        </span>
                                    </div>

                                    {sessionId && (
                                        <>
                                            <hr />

                                            <p className="small text-secondary mb-1">
                                                Referencia de Stripe
                                            </p>

                                            <p className="small text-break mb-0">
                                                {sessionId}
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="alert alert-info">
                                    Puedes consultar el estado y los productos
                                    de tu compra desde la sección
                                    <strong> Mis pedidos</strong>.
                                </div>

                                <div className="d-grid gap-2 mt-4">
                                    <Link
                                        to="/orders"
                                        className="btn btn-primary btn-lg"
                                    >
                                        Ver mis pedidos
                                    </Link>

                                    <Link
                                        to="/products"
                                        className="btn btn-outline-dark"
                                    >
                                        Seguir comprando
                                    </Link>

                                    <Link
                                        to="/"
                                        className="btn btn-link text-decoration-none"
                                    >
                                        Volver al inicio
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