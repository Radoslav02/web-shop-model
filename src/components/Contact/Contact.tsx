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
        "service_zf9aerk", // replace with your EmailJS service ID
        "template_gdn2y8x", // replace with your EmailJS template ID
        templateParams,
        "83kRfB6jgzmb21MF0" // replace with your EmailJS user ID
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
      <h1>Contact Us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div>
          <label>Ime:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Prezime:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Poruka:</label>
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
