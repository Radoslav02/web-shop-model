import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Redux/authSlice";
import "./LogIn.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        dispatch(login({ email: user.email!, isAdmin: userData.isAdmin }));

        if (userData.isAdmin) {
          navigate("/admin/panel");
        } else {
          navigate("/početna");
        }
      } else {
        setErrorMessage("User data not found in database.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Login failed: ${error.message}`);
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-page-container">
      <form className="login-page-form" onSubmit={handleLogin}>
        <div className="login-page-email-wapper">
          <label>Email:</label>
          <input
            className="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-page-password-wapper">
          <label>Password:</label>
          <input
            className="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-page-button-wapper">
          <button className="login-button" type="submit">
            Prijavi se
          </button>
          <button
            className="register-button"
            onClick={() => navigate("/registracija")}
          >
            Registruj se
          </button>
        </div>
      </form>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
};

export default LoginPage;
