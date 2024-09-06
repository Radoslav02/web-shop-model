import { createHashRouter } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart/Cart";
import ContactUs from "./components/Contact/Contact";
import LogIn from "./components/LogIn/LogIn";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
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
    ],
  },
]);
