import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  // Proveri da li je korisnik prijavljen
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  // Ako nije prijavljen, preusmeri ga na /admin
  if (!isLoggedIn) {
    return <Navigate to="/admin" />;
  }

  // Ako je prijavljen, prikaži sadržaj rute
  return <Outlet />;
};

export default PrivateRoute;
