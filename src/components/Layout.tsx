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
      <div className="bg-warning-500 text-white py-6 px-6 border-b-4 border-warning-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-6">
          <AlertTriangle className="w-12 h-12 flex-shrink-0 animate-pulse" />
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">🚧 PÁGINA WEB EN DESARROLLO 🚧</h2>
            <p className="text-lg md:text-xl font-medium">
            <strong>Aviso:</strong> Esta página web se encuentra en desarrollo y aún no está operativa. 
            Los servicios de compra, registro y reservas no están disponibles por el momento.
            </p>
          </div>
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