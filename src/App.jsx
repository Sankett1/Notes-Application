import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Hero from './Hero';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

function App() {
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <>
      <Navbar />
      {!isLoggedIn() && <Hero />}
      {isLoggedIn() && isAdmin() && <AdminDashboard />}
      {isLoggedIn() && !isAdmin() && <UserDashboard />}
    </>
  );
}

export default App;