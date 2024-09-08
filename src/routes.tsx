import { createHashRouter } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart/Cart";
import ContactUs from "./components/Contact/Contact";
import LogIn from "./components/LogIn/LogIn";
import Home from "./components/Home/Home";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Register from "./components/Register/Register";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/početna',
        element: <Home />,
      },
      {
        path: "/korpa",
        element: <Cart />,
      },
      {
        path: "/kontakt",
        element: <ContactUs />,
      },
      {
        path: "/prijava",
        element: <LogIn />,
      },
      {
        path: "/registracija",
        element: <Register />,
      },
      {
        path: '/admin/panel',
        element: <PrivateRoute />, // Zaštiti /admin/panel koristeći PrivateRoute
        children: [
          {
            path: '',
            element: <AdminPanel />,
          },
        ],
      },
    ],
  },
]);
