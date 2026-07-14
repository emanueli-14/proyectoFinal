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
import { Cart } from "./pages/Cart";
import { Profile } from "./pages/Profile";
import { Orders } from "./pages/Orders";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCancel } from "./pages/PaymentCancel";

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

			<Route path="cart" element={<Cart />} />

			<Route path="profile" element={<Profile />} />

			<Route path="orders" element={<Orders />} />

			<Route path="payment-success" element={<PaymentSuccess />} />

			<Route path="payment-cancel" element={<PaymentCancel />} />

		</Route>

	)
);