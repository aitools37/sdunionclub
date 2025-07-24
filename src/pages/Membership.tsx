import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Check, Star, Gift, CreditCard, Heart, Trophy, Calendar, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import toast from 'react-hot-toast';

const Membership: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { setMembership } = useCartStore();

  const membershipPlans = [
    {
      id: 'adulto',
      name: 'Socio Adulto',
      price: 20,
      duration: 'año',
      popular: true,
      color: 'border-gray-300',
      benefits: [
        'Entrada GRATUITA a todos los partidos del club',
        'Entrada GRATUITA a partidos del Rayo Cantabria',
        'Entrada GRATUITA a partidos del Racing Femenino',
        'Newsletter mensual exclusivo',
        'Acceso a eventos del club',
        'Descuento 10% en tienda online',
        'Prioridad en renovaciones',
        'Carnet de socio oficial',
        'Parking gratuito en La Planchada',
        'Invitación a entrenamientos abiertos'
      ],
      description: 'Para mayores de 14 años'
    },
    {
      id: 'infantil',
      name: 'Socio Infantil',
      price: 5,
      duration: 'año',
      popular: false,
      color: 'border-secondary-400',
      benefits: [
        'Entrada GRATUITA a todos los partidos del club',
        'Entrada GRATUITA a partidos del Rayo Cantabria',
        'Entrada GRATUITA a partidos del Racing Femenino',
        'Newsletter mensual exclusivo',
        'Acceso a eventos familiares del club',
        'Descuento 10% en tienda online',
        'Carnet de socio oficial',
        'Acceso prioritario a entradas',
        'Acceso a actividades para niños',
        'Descuentos especiales en eventos familiares',
        'Campamentos de verano con descuento'
      ],
      description: 'Para menores de 14 años'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    const plan = membershipPlans.find(p => p.id === planId);
    if (plan) {
      setMembership({
        id: plan.id,
        type: plan.id,
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        benefits: plan.benefits
      });
      setSelectedPlan(planId);
      toast.success(`${plan.name} seleccionado`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-primary-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Hazte Socio</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Únete a más de 1,250 socios que apoyan al S.D. Unión Club de Astillero. 
              Forma parte de nuestra familia y disfruta de beneficios exclusivos.
            </p>
            <div className="text-primary-300 font-semibold text-lg">
              "Unidos se vence siempre"
            </div>
          </div>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Elige tu Plan de Socio
          </h2>
          <p className="text-lg text-secondary-600">
            Selecciona el plan que mejor se adapte a tu pasión por el club
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${plan.color} ${
                plan.popular ? 'ring-2 ring-primary-600 ring-opacity-50' : ''
              } relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    {plan.description}
                  </p>
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    €{plan.price}
                  </div>
                  <div className="text-secondary-500">
                    por {plan.duration}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-primary-600 text-white'
                      : plan.popular
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        {selectedPlan && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                ¿Listo para unirte?
              </h3>
              <p className="text-secondary-600 mb-6">
                Completa tu registro y comienza a disfrutar de todos los beneficios
              </p>
              <Link
                to="/hazte-socio/checkout"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Completar Registro
              </Link>
            </div>
          </div>
        )}

        {/* Benefits Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Apoyo al Club
            </h3>
            <p className="text-secondary-600">
              Tu contribución ayuda directamente al desarrollo del club y sus equipos
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Experiencias Únicas
            </h3>
            <p className="text-secondary-600">
              Acceso exclusivo a eventos, entrenamientos y encuentros con jugadores
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Comunidad
            </h3>
            <p className="text-secondary-600">
              Forma parte de una familia de más de 1,250 socios apasionados
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                ¿Cuándo recibo mi carnet de socio?
              </h4>
              <p className="text-secondary-600">
                Recibirás tu carnet digital inmediatamente tras el pago. El carnet físico llegará a tu domicilio en 5-7 días laborables.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                ¿Puedo cambiar de plan durante el año?
              </h4>
              <p className="text-secondary-600">
                Sí, puedes actualizar tu plan en cualquier momento pagando la diferencia proporcional.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-secondary-900 mb-2">
                ¿Qué incluye el Plan Familiar?
              </h4>
              <p className="text-secondary-600">
                El Plan Familiar cubre hasta 4 miembros de la misma familia (2 adultos + 2 menores de 18 años).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;