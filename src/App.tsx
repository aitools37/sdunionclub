import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Store from './pages/Store';
import Merchandising from './pages/Merchandising';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tickets from './pages/Tickets';
import TicketCheckout from './pages/TicketCheckout';
import Membership from './pages/Membership';
import MembershipCheckout from './pages/MembershipCheckout';
import Calendar from './pages/Calendar';
import Classification from './pages/Classification';
import Stadium from './pages/Stadium';
import Club from './pages/Club';
import Teams from './pages/Teams';
import FirstTeam from './pages/FirstTeam';
import Marismas from './pages/Marismas';
import Youth from './pages/Youth';
import Sponsors from './pages/Sponsors';
import OrderConfirmation from './pages/OrderConfirmation';
import News from './pages/News';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#ffffff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Store />} />
            <Route path="/tienda/merchandising" element={<Merchandising />} />
            <Route path="/tienda/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/entradas" element={<Tickets />} />
            <Route path="/entradas/checkout" element={<TicketCheckout />} />
            <Route path="/hazte-socio" element={<Membership />} />
            <Route path="/hazte-socio/checkout" element={<MembershipCheckout />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/clasificacion" element={<Classification />} />
            <Route path="/estadio" element={<Stadium />} />
            <Route path="/club" element={<Club />} />
            <Route path="/equipos" element={<Teams />} />
            <Route path="/equipos/primer-equipo" element={<FirstTeam />} />
            <Route path="/equipos/marismas" element={<Marismas />} />
            <Route path="/equipos/escuelas" element={<Youth />} />
            <Route path="/patrocinadores" element={<Sponsors />} />
            <Route path="/confirmacion/:type/:id" element={<OrderConfirmation />} />
            <Route path="/noticias" element={<News />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;