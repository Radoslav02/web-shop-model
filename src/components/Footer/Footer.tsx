import "./Footer.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-wrapper">
      <div className="contact-wrapper">
        <h2>Kontakt:</h2>
        <p>E-mail: web.shopg@gmail.com</p>
        <p>Telefon: 069 123456</p>
      </div>
      <div className="socials-wrapper">
        <h2>Zapratite nas:</h2>
        <div className="icons-wrapper">
          <a href="link ka instagramu">
            <FacebookIcon className="icon" sx={{fontSize: 40}}/>
          </a>
          <a href="link ka facebook-u">
            <InstagramIcon className="icon" sx={{fontSize: 40}} />
          </a>
        </div>
      </div>
      <div className="adress-wrapper">
        <h2>Adresa:</h2>
        <p>Petra Petrovica 10</p>
      </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 SN. All rights reserved.</p>
      </div>
    </div>
  );
}
