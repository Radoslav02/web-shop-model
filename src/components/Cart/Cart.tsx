import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { RootState } from "../Redux/store";
import { removeFromCart } from "../Redux/cartSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Cart.css";
import { Button } from "@mui/material";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  const deliveryCost = 350.0; // Delivery cost
  const finalTotal = totalPrice + deliveryCost;

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Handle order button click
  const handleOrder = () => {
    const orderDetails = {
      customer: {
        email: user?.email,
        name: user?.name,
        number: user?.number,
        phoneNumber: user?.phoneNumber,
        place: user?.place,
        postalCode: user?.postalCode,
        street: user?.street,
        surname: user?.surname,
      },
      total: finalTotal,
    };
    navigate("/poručivanje", { state: orderDetails });
  };

  return (
    <div className="cart-container">
      <h2>Vaša korpa</h2>
      {!user ? ( // Check if the user is logged in
        <p>Morate biti prijavljeni da biste videli vašu korpu.</p>
      ) : cartItems.length === 0 ? (
        <p>Vaša korpa je prazna</p>
      ) : (
        <div className="cart-items-wrapper">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <p>Veličina: {item.size}</p>
                <p className="cart-item-price">
                  Cena: {formatPrice(item.price)}
                </p>
              </div>
              <div
                className="cart-delete-button"
                onClick={() => handleRemoveItem(item.productId)}
                aria-label="delete"
              >
                <DeleteIcon sx={{ fontSize: 35 }} />
              </div>
            </div>
          ))}
          <div className="total-price-container">
            <h4>Ukupna cena: {formatPrice(totalPrice)}</h4>
            <h4>Troškovi dostave: {formatPrice(deliveryCost)}</h4>
            <h3>Ukupno za plaćanje: {formatPrice(finalTotal)}</h3>
          </div>

          <div className="cart-button-wrapper">
            <Button  variant='contained' sx={{backgroundColor:'primary.main'}} className="to-home-button" onClick={() => navigate("/početna")}>Početna</Button>
            <Button variant='contained' sx={{backgroundColor:'primary.main'}} onClick={handleOrder} className="order-button">
              Poruči
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
