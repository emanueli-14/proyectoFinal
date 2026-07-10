import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Products } from "./pages/Products";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter(
	createRoutesFromElements(

		<Route
			path="/"
			element={<Layout />}
			errorElement={<h1>Página no encontrada</h1>}
		>

			<Route index element={<Home />} />

			<Route path="login" element={<Login />} />

			<Route path="register" element={<Register />} />

			<Route path="products" element={<Products />} />

			<Route path="products/:id" element={<ProductDetail />} />

			<Route path="cart" element={<Cart />} />

			<Route path="profile" element={<Profile />} />

		</Route>

	)
);