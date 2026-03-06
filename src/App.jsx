import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Team from './components/Team.jsx';
import Booking from './components/booking/Booking.jsx';
import Footer from './components/Footer.jsx';
import AdminPanel from './components/AdminPanel.jsx';

// Enrutamiento minimalista sin dependencias externas:
// /admin → panel de administración (autenticado con contraseña)
// cualquier otra ruta → landing page pública
const isAdmin = window.location.pathname === '/admin';

export default function App() {
  if (isAdmin) return <AdminPanel />;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Team />
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
