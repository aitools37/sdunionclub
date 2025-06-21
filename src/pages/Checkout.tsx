import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CreditCard, Truck, MapPin, User, Mail, Phone } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'paypal' | 'transfer';
}

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'card',
    }
  });

  const shippingMethod = watch('shippingMethod');
  const paymentMethod = watch('paymentMethod');

  const subtotal = getTotalPrice();
  const shippingCost = shippingMethod === 'express' ? 6.95 : subtotal >= 50 ? 0 : 3.95;
  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to confirmation
      clearCart();
      const orderId = Date.now().toString();
      toast.success('¡Pedido realizado con éxito!');
      navigate(`/confirmacion/tienda/${orderId}`);
    } catch (error) {
      toast.error('Error al procesar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-secondary-400 mb-4">
            <CreditCard className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            No hay productos en el carrito
          </h2>
          <p className="text-secondary-600 mb-8">
            Añade algunos productos antes de proceder al checkout
          </p>
          <Link
            to="/tienda"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/carrito"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al carrito
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900">Finalizar Compra</h1>
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
                    Información de Contacto
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
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Dirección de Envío
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      {...register('address', { required: 'La dirección es requerida' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Calle, número, piso, puerta"
                    />
                    {errors.address && (
                      <p className="text-error-600 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        {...register('city', { required: 'La ciudad es requerida' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.city && (
                        <p className="text-error-600 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Código Postal *
                      </label>
                      <input
                        type="text"
                        {...register('postalCode', { required: 'El código postal es requerido' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {errors.postalCode && (
                        <p className="text-error-600 text-sm mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Truck className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Método de Envío
                  </h2>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="standard"
                      {...register('shippingMethod')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-secondary-900">Envío Estándar</div>
                          <div className="text-sm text-secondary-600">5-7 días laborables</div>
                        </div>
                        <div className="text-lg font-semibold text-secondary-900">
                          {subtotal >= 50 ? 'Gratis' : '€3.95'}
                        </div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="express"
                      {...register('shippingMethod')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-secondary-900">Envío Express</div>
                          <div className="text-sm text-secondary-600">2-3 días laborables</div>
                        </div>
                        <div className="text-lg font-semibold text-secondary-900">€6.95</div>
                      </div>
                    </div>
                  </label>
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
                      value="transfer"
                      {...register('paymentMethod')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-secondary-900">Transferencia Bancaria</div>
                      <div className="text-sm text-secondary-600">Recibirás las instrucciones por email</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">
                  Resumen del Pedido
                </h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-secondary-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {item.size && `Talla: ${item.size} • `}Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Subtotal</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Envío</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
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
                  {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
                
                <div className="text-center text-xs text-secondary-500 mt-4">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Lock className="w-3 h-3" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div>Encriptado SSL de 256 bits</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;