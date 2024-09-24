import { useState } from "react";
import emailjs from "emailjs-com"; // Import emailjs
import { toast } from "react-toastify";
import "./Contact.css";

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    };

    emailjs
      .send(
        "service_zf9aerk",
        "template_gdn2y8x",
        templateParams,
        "83kRfB6jgzmb21MF0"
      )
      .then((response) => {
        console.log("Success:", response);
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
        toast.success("Message sent successfully!");
        setIsSending(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to send message. Please try again.");
        setIsSending(false);
      });
  };

  return (
    <div className="contact-page-container">
      <form className="contact-page-form" onSubmit={handleSubmit}>
        <h1>Kontaktirajte nas</h1>
        <div className="name-surname-contact-wrapper">
          <div className="conatact-input-wrapper">
            <label>Ime:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="name-input"
            />
          </div>
          <div className="conatact-input-wrapper">
            <label>Prezime:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="surname-input"
            />
          </div>
        </div>
        <div className="conatact-input-wrapper">
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="contact-email-input"
          />
        </div>
        <div className="conatact-input-wrapper">
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
