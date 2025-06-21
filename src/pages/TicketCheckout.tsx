import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CreditCard, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface TicketCheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
  paymentMethod: 'card' | 'paypal' | 'bizum';
}

const TicketCheckout: React.FC = () => {
  const { tickets, getTicketsTotalPrice, clearTickets } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TicketCheckoutForm>({
    defaultValues: {
      paymentMethod: 'card',
    }
  });

  const paymentMethod = watch('paymentMethod');
  const total = getTicketsTotalPrice();

  const onSubmit = async (data: TicketCheckoutForm) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear tickets and redirect to confirmation
      clearTickets();
      const orderId = Date.now().toString();
      toast.success('¡Entradas compradas con éxito!');
      navigate(`/confirmacion/entradas/${orderId}`);
    } catch (error) {
      toast.error('Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-secondary-400 mb-4">
            <CreditCard className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            No hay entradas en el carrito
          </h2>
          <p className="text-secondary-600 mb-8">
            Selecciona entradas antes de proceder al checkout
          </p>
          <Link
            to="/entradas"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ver entradas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/entradas"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a entradas
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900">Finalizar Compra de Entradas</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Información del Comprador
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: 'El email es requerido' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="text-error-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'El teléfono es requerido' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+34 600 000 000"
                    />
                    {errors.phone && (
                      <p className="text-error-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'El nombre es requerido' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.firstName && (
                      <p className="text-error-600 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      {...register('lastName', { required: 'Los apellidos son requeridos' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.lastName && (
                      <p className="text-error-600 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      DNI/NIE *
                    </label>
                    <input
                      type="text"
                      {...register('dni', { required: 'El DNI/NIE es requerido' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="12345678X"
                    />
                    {errors.dni && (
                      <p className="text-error-600 text-sm mt-1">{errors.dni.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Método de Pago
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="card"
                      {...register('paymentMethod')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-secondary-900">Tarjeta de Crédito/Débito</div>
                      <div className="text-sm text-secondary-600">Visa, Mastercard, American Express</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="paypal"
                      {...register('paymentMethod')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-secondary-900">PayPal</div>
                      <div className="text-sm text-secondary-600">Paga con tu cuenta PayPal</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="bizum"
                      {...register('paymentMethod')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-secondary-900">Bizum</div>
                      <div className="text-sm text-secondary-600">Pago instantáneo desde tu móvil</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">
                  Resumen de Entradas
                </h2>
                
                <div className="space-y-4 mb-6">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="border-b border-gray-100 pb-4">
                      <div className="font-semibold text-secondary-900 mb-2">
                        {ticket.matchTitle}
                      </div>
                      <div className="text-sm text-secondary-600 mb-2 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(ticket.date).toLocaleDateString('es-ES')} - {ticket.time}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <div className="text-secondary-900">{ticket.ticketType}</div>
                          <div className="text-secondary-500">Cantidad: {ticket.quantity}</div>
                        </div>
                        <div className="text-sm font-medium text-secondary-900">
                          €{(ticket.price * ticket.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-4 rounded-lg font-semibold transition-colors mt-6 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="w-5 h-5 mr-2" />
                  )}
                  {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
                </button>
                
                <div className="text-center text-xs text-secondary-500 mt-4">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Lock className="w-3 h-3" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div>Las entradas se enviarán por email</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketCheckout;