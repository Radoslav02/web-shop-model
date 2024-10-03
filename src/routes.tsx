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
import FemalePage from "./components/FemalePage/FemalePage";
import MalePage from "./components/MalePage/MalePage";
import ItemDetails from "./components/ItemDetails/ItemDetails";
import Order from "./components/Order/Order";

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
        path: "/žene",
        element: <FemalePage />
      },
      {
        path: "/muškarci",
        element: <MalePage />
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
      {
        path: "/proizvod/:productId", // Dynamic route for item details
        element: <ItemDetails />, // Render the ItemDetails component
      },
      {
        path: "/poručivanje", 
        element: <Order />, 
      },
    ],
  },
]);
