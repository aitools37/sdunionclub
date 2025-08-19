import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { AlertTriangle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Development Notice Banner */}
      <div className="bg-warning-500 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p className="text-center text-sm font-medium">
            <strong>Aviso:</strong> Esta página web se encuentra en desarrollo y aún no está operativa. 
            Los servicios de compra, registro y reservas no están disponibles por el momento.
          </p>
        </div>
      </div>
      
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;