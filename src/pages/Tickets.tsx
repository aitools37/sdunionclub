import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

const Tickets: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({});
  const { addTicket, getTicketsTotalPrice } = useCartStore();

  const upcomingMatches = [
    {
      id: '1',
      title: 'UCA vs Samano B',
      opponent: 'Samano B',
      date: '2026-02-15',
      time: '17:00',
      venue: 'Campos de Sport La Planchada',
      competition: 'Segunda Regional Grupo C',
      image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      ticketTypes: [
        { id: 'general', name: 'Entrada General', price: 5, available: 450 },
        { id: 'tribuna', name: 'Tribuna', price: 5, available: 167 },
      ],
    },
    {
      id: '2',
      title: 'EMF Meruelo vs UCA',
      opponent: 'EMF Meruelo',
      date: '2026-02-22',
      time: '16:00',
      venue: 'Campo Municipal Meruelo',
      competition: 'Segunda Regional Grupo C',
      image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      ticketTypes: [
        { id: 'general', name: 'Entrada General', price: 5, available: 300 },
        { id: 'tribuna', name: 'Tribuna', price: 5, available: 100 },
      ],
    },
    {
      id: '3',
      title: 'UCA vs Marina de Cudeyo',
      opponent: 'Marina de Cudeyo',
      date: '2026-03-01',
      time: '17:00',
      venue: 'Campos de Sport La Planchada',
      competition: 'Segunda Regional Grupo C',
      image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop',
      ticketTypes: [
        { id: 'general', name: 'Entrada General', price: 5, available: 450 },
        { id: 'tribuna', name: 'Tribuna', price: 5, available: 167 },
      ],
    },
  ];

  const handleQuantityChange = (matchId: string, ticketTypeId: string, change: number) => {
    const key = `${matchId}-${ticketTypeId}`;
    const currentQuantity = ticketQuantities[key] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    
    setTicketQuantities(prev => ({
      ...prev,
      [key]: newQuantity
    }));
  };

  const handleAddToCart = (matchId: string, ticketTypeId: string) => {
    const match = upcomingMatches.find(m => m.id === matchId);
    const ticketType = match?.ticketTypes.find(t => t.id === ticketTypeId);
    const quantity = ticketQuantities[`${matchId}-${ticketTypeId}`] || 0;

    if (!match || !ticketType || quantity === 0) return;

    addTicket({
      matchId,
      matchTitle: match.title,
      date: match.date,
      time: match.time,
      ticketType: ticketType.name,
      price: ticketType.price,
      quantity,
    });

    toast.success(`${quantity} entrada(s) para ${match.title} añadida(s) al carrito`);
    
    // Reset quantity
    setTicketQuantities(prev => ({
      ...prev,
      [`${matchId}-${ticketTypeId}`]: 0
    }));
  };

  const getTotalForMatch = (matchId: string) => {
    const match = upcomingMatches.find(m => m.id === matchId);
    if (!match) return 0;

    return match.ticketTypes.reduce((total, ticketType) => {
      const quantity = ticketQuantities[`${matchId}-${ticketType.id}`] || 0;
      return total + (ticketType.price * quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Entradas</h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Consigue tus entradas para los próximos partidos del S.D. Unión Club de Astillero
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Match Header */}
              <div className="relative">
                <img
                  src={match.image}
                  alt={match.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-3xl font-bold mb-2">{match.title}</h2>
                    <div className="text-primary-300 font-semibold text-lg">
                      {match.competition}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-semibold text-secondary-900">
                        {new Date(match.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-semibold text-secondary-900">{match.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <div>
                      <div className="font-semibold text-secondary-900">{match.venue}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-secondary-900 mb-6">Tipos de Entradas</h3>
                <div className="space-y-4">
                  {match.ticketTypes.map((ticketType) => {
                    const quantity = ticketQuantities[`${match.id}-${ticketType.id}`] || 0;
                    return (
                      <div key={ticketType.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary-900 mb-1">
                            {ticketType.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-secondary-600">
                            <span className="font-bold text-primary-600 text-lg">
                              €{ticketType.price}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{ticketType.available} disponibles</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(match.id, ticketType.id, -1)}
                              disabled={quantity === 0}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 border border-gray-300 rounded min-w-[50px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(match.id, ticketType.id, 1)}
                              disabled={quantity >= ticketType.available}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(match.id, ticketType.id)}
                            disabled={quantity === 0}
                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Añadir al carrito
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Match Total */}
                {getTotalForMatch(match.id) > 0 && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-secondary-900">
                        Total para este partido:
                      </span>
                      <span className="text-xl font-bold text-primary-600">
                        €{getTotalForMatch(match.id).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {getTicketsTotalPrice() > 0 && (
          <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl p-6 border border-gray-200">
            <div className="text-center">
              <div className="text-sm text-secondary-600 mb-2">Total en carrito</div>
              <div className="text-2xl font-bold text-primary-600 mb-4">
                €{getTicketsTotalPrice().toFixed(2)}
              </div>
              <Link
                to="/entradas/checkout"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Proceder al pago
              </Link>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-secondary-900 mb-6">Información Importante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">Sobre las Entradas</h4>
              <ul className="space-y-2 text-secondary-600">
                <li>• Todas las entradas cuestan 5€ independientemente de la edad</li>
                <li>• Los socios del club entran GRATIS a todos los partidos</li>
                <li>• Las entradas se envían por email tras la compra</li>
                <li>• Puedes mostrar la entrada en tu móvil o imprimirla</li>
                <li>• Beneficios adicionales con el carnet de socio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3">Política de Devoluciones</h4>
              <ul className="space-y-2 text-secondary-600">
                <li>• Devolución gratuita hasta 24h antes del partido</li>
                <li>• En caso de suspensión, reembolso automático</li>
                <li>• Contacta con el club para cambios de último momento</li>
                <li>• Transferencia entre socios permitida</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;