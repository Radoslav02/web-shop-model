import { useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from '../Redux/store';


interface Customer {
  email: string;
  name: string;
  number: string;
  phoneNumber: string;
  place: string;
  postalCode: string;
  street: string;
  surname: string;
}

interface Item {
  name: string;
  size: string; // Adjust type as needed
  price: number; // Adjust type as needed
}

const Order = () => {
  const location = useLocation();
  
  // Type the state object
  const { customer, total } = location.state as {
    customer: Customer; 
    total: number; 
  } || {}; 

  const items = useSelector((state: RootState) => state.cart.items); // Get items from Redux store

  const [isEmailSent, setIsEmailSent] = useState(false);

  const sendEmail = () => {
    if (!items || items.length === 0) {
      alert("Nema poručenih proizvoda."); // Notify the user about empty items
      return;
    }

    const templateParams = {
      customerEmail: customer?.email,
      customerName: customer?.name,
      customerNumber: customer?.number,
      customerPhoneNumber: customer?.phoneNumber,
      customerPlace: customer?.place,
      customerPostalCode: customer?.postalCode,
      customerStreet: customer?.street,
      customerSurname: customer?.surname,
      total,
      items: items.map((item: Item) => `Naziv: ${item.name}, Velicina: ${item.size}, Cena: ${item.price}`).join('\n'),
    };
  
    emailjs.send('service_zf9aerk', 'template_gd7rbar', templateParams, '83kRfB6jgzmb21MF0')
      .then(() => {
        setIsEmailSent(true);
      })
      .catch((error) => {
        console.error('Email sending error:', error);
        alert(`Error: ${error.text || error.message}`);
      });
  };

  return (
    <div>
      <h2>Detalji porudžbine</h2>
      {customer ? (
        <div>
          <h3>Podaci o klijentu:</h3>
          <p>Email: {customer.email}</p>
          <p>Ime: {customer.name}</p>
          <p>Broj: {customer.number}</p>
          <p>Telefon: {customer.phoneNumber}</p>
          <p>Mesto: {customer.place}</p>
          <p>Poštanski broj: {customer.postalCode}</p>
          <p>Ulica: {customer.street}</p>
          <p>Prezime: {customer.surname}</p>
          <h3>Ukupno za plaćanje: {total}</h3>
          <button onClick={sendEmail}>Poruci</button>
          {isEmailSent && <p>Poruka je uspešno poslata!</p>}
        </div>
      ) : (
        <p>Nema podataka o klijentu.</p>
      )}
    </div>
  );
};

export default Order;
