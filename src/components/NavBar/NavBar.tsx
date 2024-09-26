import { useNavigate } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="nav-bar-container">
      <div className="nav-item" onClick={() => navigate("/Početna")}>
        <h3>Početna</h3>
      </div>
      <div className="nav-item" onClick={() => navigate("/muškarci")}>
        <h3>Muškarci</h3>
      </div>
      <div className="nav-item" onClick={() => navigate("/žene")}>
        <h3>Žene</h3>
      </div>
    </div>
  );
}
