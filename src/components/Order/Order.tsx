
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../Redux/store';
// import { clearCart } from '../Redux/cartSlice';
// import { SMTPClient } from 'emailjs'; // Import the SMTPClient class correctly
// import "./Order.css";

// interface Customer {
//   email: string;
//   name: string;
//   number: string;
//   phoneNumber: string;
//   place: string;
//   postalCode: string;
//   street: string;
//   surname: string;
// }

// interface Item {
//   name: string;
//   size: string;
//   price: number;
// }

 const Order = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { customer, total } = location.state as {
//     customer: Customer;
//     total: number;
//   } || {};

//   const items = useSelector((state: RootState) => state.cart.items);

//   const [isEmailSent, setIsEmailSent] = useState(false);

//   const sendEmail = () => {
//     if (!items || items.length === 0) {
//       alert("Nema poručenih proizvoda.");
//       return;
//     }

//     const client = new SMTPClient({
//       user: 'web.shopg69@gmail.com', // Replace with your SMTP credentials
//       password: 'gardinovci',
//       host: 'smtp.gmail.com', // Replace with your email provider's SMTP host
//       ssl: true, // Use SSL for secure connections
//     });

//     // Directly pass the values to client.send()
//     client.send(
//       {
//         text: `Porudžbina za klijenta:\n\nIme: ${customer?.name}\nPrezime: ${customer?.surname}\nEmail: ${customer?.email}\nTelefon: ${customer?.phoneNumber}\nAdresa: ${customer?.street}, ${customer?.place} ${customer?.postalCode}\n\nProizvodi:\n${items.map((item: Item) => `Naziv: ${item.name}, Velicina: ${item.size}, Cena: ${item.price}`).join('\n')}\n\nUkupno za plaćanje: ${formatPrice(total)}`,
//         from: 'web.shopg69@gmail.com', // Replace with the correct "from" address
//         to: customer?.email, // Send the email to the customer
//         subject: 'Potvrda porudžbine',
//       },
//       (err) => {
//         if (err) {
//           console.error('Email sending error:', err);
//           alert(`Greška pri slanju emaila: ${err.message}`);
//         } else {
//           dispatch(clearCart());
//           setIsEmailSent(true);
//           navigate('/potvrda');
//         }
//       }
//     );
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("sr-RS", {
//       style: "currency",
//       currency: "RSD",
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(price);
//   };

//   return (
//     <div className="order-container">
//       <h2>Detalji porudžbine</h2>
//       {customer ? (
//         <div className="customer-info-wrapper">
//           <h3>Podaci o klijentu:</h3>
//           <div className="show-profile">
//             <p>Email: {customer.email}</p>
//             <p>Ime: {customer.name}</p>
//             <p>Broj: {customer.number}</p>
//             <p>Telefon: {customer.phoneNumber}</p>
//             <p>Mesto: {customer.place}</p>
//             <p>Poštanski broj: {customer.postalCode}</p>
//             <p>Ulica: {customer.street}</p>
//             <p>Prezime: {customer.surname}</p>
//             <h3>Ukupno za plaćanje: {formatPrice(total)}</h3>
//           </div>
//         </div>
//       ) : (
//         <p>Nema podataka o klijentu.</p>
//       )}
//       <div className="order-button-wrapper">
//         <button className="back-button" onClick={() => navigate(-1)}>Nazad</button>
//         <button className="order-button" onClick={sendEmail}>Poruči</button>
//         {isEmailSent && <p>Poruka je uspešno poslata!</p>}
//       </div>
//     </div>
//   );
 };

 export default Order;
