import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CreditCard, User, Mail, Phone, Users, Calendar } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface MembershipCheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
  address: string;
  city: string;
  postalCode: string;
  birthDate: string;
  paymentMethod: 'card' | 'paypal' | 'transfer';
  paymentFrequency: 'annual' | 'quarterly';
  // Family members (if applicable)
  familyMembers?: {
    name: string;
    dni: string;
    birthDate: string;
  }[];
}

const MembershipCheckout: React.FC = () => {
  const { membership, clearMembership } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<MembershipCheckoutForm>({
    defaultValues: {
      paymentMethod: 'card',
      paymentFrequency: 'annual',
    }
  });

  const paymentFrequency = watch('paymentFrequency');
  
  if (!membership) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-secondary-400 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">
            No has seleccionado ningún plan
          </h2>
          <p className="text-secondary-600 mb-8">
            Selecciona un plan de socio antes de proceder
          </p>
          <Link
            to="/hazte-socio"
            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Seleccionar Plan
          </Link>
        </div>
      </div>
    );
  }

  const calculatePrice = () => {
    if (paymentFrequency === 'quarterly') {
      return (membership.price / 4) * 1.05; // Small surcharge for quarterly payments
    }
    return membership.price;
  };

  const onSubmit = async (data: MembershipCheckoutForm) => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear membership and redirect to confirmation
      clearMembership();
      const memberId = Date.now().toString();
      toast.success('¡Bienvenido como socio del club!');
      navigate(`/confirmacion/socio/${memberId}`);
    } catch (error) {
      toast.error('Error al procesar el registro');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/hazte-socio"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a planes de socio
          </Link>
          <h1 className="text-3xl font-bold text-secondary-900">Completar Registro de Socio</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Registration Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Información Personal
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  <div>
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
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      {...register('birthDate', { required: 'La fecha de nacimiento es requerida' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.birthDate && (
                      <p className="text-error-600 text-sm mt-1">{errors.birthDate.message}</p>
                    )}
                  </div>
                  
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
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-6">
                  Dirección de Envío del Carnet
                </h3>
                
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

              {/* Payment Options */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Forma de Pago
                  </h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-medium text-secondary-900 mb-3">Frecuencia de Pago</h4>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="annual"
                          {...register('paymentFrequency')}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-secondary-900">Pago Anual</div>
                          <div className="text-sm text-secondary-600">€{membership.price} por año</div>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="quarterly"
                          {...register('paymentFrequency')}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <div className="ml-3">
                          <div className="font-medium text-secondary-900">Pago Trimestral</div>
                          <div className="text-sm text-secondary-600">
                            €{((membership.price / 4) * 1.05).toFixed(2)} cada 3 meses
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-secondary-900 mb-3">Método de Pago</h4>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="card"
                        {...register('paymentMethod')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-secondary-900">Tarjeta de Crédito/Débito</div>
                        <div className="text-sm text-secondary-600">Domiciliación automática</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="transfer"
                        {...register('paymentMethod')}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-secondary-900">Transferencia Bancaria</div>
                        <div className="text-sm text-secondary-600">Solo para pago anual</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-secondary-900 mb-6">
                  Resumen de Socio
                </h2>
                
                <div className="mb-6">
                  <div className="text-xl font-bold text-primary-600 mb-2">
                    {membership.name}
                  </div>
                  <div className="text-sm text-secondary-600 mb-4">
                    Válido por {membership.duration}
                  </div>
                  
                  <div className="space-y-2 text-sm text-secondary-600">
                    {membership.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                    <div className="text-primary-600 font-medium">
                      +{membership.benefits.length - 3} beneficios más
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-secondary-600">
                      {paymentFrequency === 'annual' ? 'Pago anual' : 'Pago trimestral'}
                    </span>
                    <span className="font-medium">
                      €{calculatePrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>€{calculatePrice().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="w-5 h-5 mr-2" />
                  )}
                  {isProcessing ? 'Procesando...' : 'Hacerme Socio'}
                </button>
                
                <div className="text-center text-xs text-secondary-500 mt-4">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Lock className="w-3 h-3" />
                    <span>Proceso 100% seguro</span>
                  </div>
                  <div>Carnet digital inmediato</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MembershipCheckout;