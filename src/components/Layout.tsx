import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import { AlertTriangle, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {showBanner && (
        <div className="bg-amber-500 text-white relative z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 justify-center">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-medium">
                Web en desarrollo - Los servicios de compra y registro no estan disponibles.
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="ml-4 p-1 hover:bg-amber-600 rounded transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
