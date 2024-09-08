import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);  // Reset error message

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
      onLoginSuccess(); // Call the success callback
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Login failed: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  const handlePasswordReset = async () => {
    setResetMessage(null); // Reset any previous message
    setErrorMessage(null); // Reset error message

    if (!email) {
      setErrorMessage('Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(`Failed to send reset email: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      
      {/* Display error message */}
      {errorMessage && <div className="error">{errorMessage}</div>}

      {/* Password Reset Section */}
      <div>
        <button onClick={handlePasswordReset}>Forgot Password?</button>
        {/* Display reset message */}
        {resetMessage && <div className="reset-message">{resetMessage}</div>}
      </div>
    </div>
  );
};

export default LoginForm;
