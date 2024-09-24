import "./Header.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "../Redux/store";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

export default function Header() {
  const navigate = useNavigate();

  // Pristupi Redux stanju
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Proveri da li je korisnik admin
  const isAdmin = user?.isAdmin;

  return (
    <div className="header-container">
      <div className="logo-container">
        <img
          src="src/assets/Logo.png"
          alt="Ovde ide slika"
          className="logo-picture"
          onClick={() => navigate("/početna")}
        />
        <h1 onClick={() => navigate("/početna")}>My company</h1>
      </div>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Pretražite ovde"
        />
        <div className="search-icon-container">
          <SearchOutlinedIcon sx={{ fontSize: 30 }} />
        </div>
      </div>
      <div className="header-menu-container">
        <div className="cart-container" onClick={() => navigate("/korpa")}>
          <ShoppingCartOutlinedIcon sx={{ fontSize: 40 }} />
          <label className="header-menu-label">Korpa</label>
        </div>
        <div className="login-container" onClick={() => navigate(user ? "/profil" : "/prijava")}>
          <AccountCircleOutlinedIcon sx={{ fontSize: 40 }} />
          <label className="header-menu-label">{user ? 'Profil' : 'Prijava'}</label>
        </div>
        <div className="contact-container" onClick={() => navigate("/kontakt")}>
          <PhoneOutlinedIcon sx={{ fontSize: 40 }} />
          <label className="header-menu-label">Kontakt</label>
        </div>
        {/* Prikazivanje admin ikonice samo ako je ulogovan admin */}
        {isAdmin && (
          <div className="admin-icon-container" onClick={() => navigate("/admin/panel")}>
            <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 40 }} />
            <label className="header-menu-label">Admin</label>
          </div>
        )}
      </div>
    </div>
  );
}
