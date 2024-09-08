import { Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/početna");
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
