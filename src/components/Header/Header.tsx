import "./Header.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();
  
  return (
    <div className="header-container" >
      <div className="logo-container" onClick={() => navigate("/")}>
        <img
          src="src/assets/Logo.png"
          alt="Ovde ide slika"
          className="logo-picture"
        />
        <h1>Lion company</h1>
      </div>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Pretrazite ovde"
        />
        <div className="search-icon-container">
          <SearchOutlinedIcon sx={{ fontSize: 30 }} />
        </div>
        
      </div>
      <div className="header-menu-container">
            <div className="cart-container" onClick={() => navigate("/korpa")} >
              <ShoppingCartOutlinedIcon sx={{ fontSize: 40 }}/>
              <label>Korpa</label>
            </div>
            <div className="login-container" onClick={() => navigate("/prijava")}>
              <AccountCircleOutlinedIcon sx={{ fontSize: 40 }}/>
              <label>Prijava</label>
            </div>
            <div className="contact-container" onClick={() => navigate("/kontakt")}>
              <PhoneOutlinedIcon sx={{ fontSize: 40 }}/>
              <label>Kontakt</label>
            </div>
        </div>
    </div>
  );
}
