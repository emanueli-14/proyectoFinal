import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${backendUrl}/api/products`
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "No se pudieron cargar los productos."
                );
                return;
            }

            setProducts(data.products || []);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await fetch(
                `${backendUrl}/api/categories`
            );

            const data = await response.json();

            if (response.ok) {
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === "" ||
            String(product.category_id) === selectedCategory;

        return matchesSearch && matchesCategory;
    });

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
                    Cargando productos...
                </p>
            </main>
        );
    }

    return (
        <main className="py-5 bg-light">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <h1 className="fw-bold mb-1">
                            Productos
                        </h1>

                        <p className="text-secondary mb-0">
                            Explora todos los productos disponibles.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-8">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(event) =>
                                setSelectedCategory(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                Todas las categorías
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="display-4 mb-3">
                            📦
                        </div>

                        <h2 className="h4">
                            No hay productos disponibles
                        </h2>

                        <p className="text-secondary">
                            Todavía no se han creado productos o no coinciden con tu búsqueda.
                        </p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredProducts.map((product) => (
                            <div
                                className="col-12 col-md-6 col-lg-4"
                                key={product.id}
                            >
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};