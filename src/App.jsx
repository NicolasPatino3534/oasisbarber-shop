import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Team from './components/Team.jsx';
import Booking from './components/booking/Booking.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
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
