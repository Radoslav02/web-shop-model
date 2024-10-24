import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../Redux/store";
import "./Contact.css";

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const userEmail = useSelector((state: RootState) => state.auth.user?.email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !message) {
      toast.error("All fields are required.");
      return;
    }

    setIsSending(true);

    const templateParams = {
      from_name: `${firstName} ${lastName}`,
      from_email: email,
      message: message,
      to: userEmail || 'default@example.com',
    };

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateParams),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="contact-page-container">
      <form className="contact-page-form" onSubmit={handleSubmit}>
        <h1>Kontaktirajte nas</h1>
        <div className="name-surname-contact-wrapper">
          <div className="contact-input-wrapper">
            <label>Ime:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="name-input"
            />
          </div>
          <div className="contact-input-wrapper">
            <label>Prezime:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="surname-input"
            />
          </div>
        </div>
        <div className="contact-input-wrapper">
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="contact-email-input"
          />
        </div>
        <div className="contact-input-wrapper">
          <label>Poruka:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="message-area"
          ></textarea>
        </div>
        <div>
          <button className="send-message-button" type="submit" disabled={isSending}>
            {isSending ? "Slanje..." : "Pošaljite"}
          </button>
        </div>
      </form>
    </div>
  );
}
