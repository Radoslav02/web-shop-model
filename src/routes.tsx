// src/router.tsx
import { createHashRouter } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart/Cart";
import ContactUs from "./components/Contact/Contact";
import LogIn from "./components/LogIn/LogIn";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register";
import ProfilePage from "./components/UserProfile/ProfilePage";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

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
        path: "/profil",
        element: (
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/panel",
        element: (
          <PrivateRoute adminOnly>
            <AdminPanel />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
