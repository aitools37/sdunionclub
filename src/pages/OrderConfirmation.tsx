import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Mail, Calendar, MapPin, User, Package, CreditCard } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const { type, id } = useParams();

  const getConfirmationData = () => {
    switch (type) {
      case 'tienda':
        return {
          title: '¡Pedido Confirmado!',
          subtitle: 'Tu pedido ha sido procesado correctamente',
          icon: Package,
          orderNumber: `TDA-${id}`,
          details: [
            'Recibirás un email de confirmación en breve',
            'El pedido será procesado en 24-48 horas',
            'Tiempo estimado de entrega: 3-5 días laborables',
            'Podrás seguir tu pedido desde tu email'
          ],
          nextSteps: [
            { text: 'Seguir comprando', link: '/tienda', primary: false },
            { text: 'Ver mi cuenta', link: '#', primary: true }
          ]
        };
      
      case 'entradas':
        return {
          title: '¡Entradas Confirmadas!',
          subtitle: 'Tus entradas han sido reservadas correctamente',
          icon: CheckCircle,
          orderNumber: `ENT-${id}`,
          details: [
            'Las entradas se han enviado a tu email',
            'Puedes mostrarlas en tu móvil o imprimirlas',
            'Llega 30 minutos antes del partido',
            'Presenta tu DNI junto con las entradas'
          ],
          nextSteps: [
            { text: 'Ver más partidos', link: '/entradas', primary: false },
            { text: 'Descargar entradas', link: '#', primary: true }
          ]
        };
      
      case 'socio':
        return {
          title: '¡Bienvenido como Socio!',
          subtitle: 'Tu registro como socio ha sido completado',
          icon: User,
          orderNumber: `SOC-${id}`,
          details: [
            'Tu carnet digital está disponible inmediatamente',
            'El carnet físico llegará en 5-7 días laborables',
            'Ya puedes disfrutar de todos los beneficios',
            'Recibirás información sobre eventos exclusivos'
          ],
          nextSteps: [
            { text: 'Ver beneficios', link: '/hazte-socio', primary: false },
            { text: 'Descargar carnet digital', link: '#', primary: true }
          ]
        };
      
      default:
        return {
          title: '¡Confirmado!',
          subtitle: 'Tu solicitud ha sido procesada',
          icon: CheckCircle,
          orderNumber: `ORD-${id}`,
          details: [],
          nextSteps: []
        };
    }
  };

  const confirmationData = getConfirmationData();
  const Icon = confirmationData.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-600 text-white text-center py-12">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{confirmationData.title}</h1>
            <p className="text-primary-100 text-lg">{confirmationData.subtitle}</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-sm text-secondary-500 mb-2">Número de confirmación</div>
              <div className="text-2xl font-bold text-secondary-900">{confirmationData.orderNumber}</div>
            </div>

            {/* Details List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información importante:</h3>
              <ul className="space-y-3">
                {confirmationData.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-600">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">¿Necesitas ayuda?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-secondary-400 mr-3" />
                  <span className="text-secondary-600">info@sdunionastillero.es</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-secondary-400 mr-3" />
                  <span className="text-secondary-600">Lunes a Viernes: 9:00 - 18:00</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-secondary-400 mr-3" />
                  <span className="text-secondary-600">Campos de Sport La Planchada</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {confirmationData.nextSteps.map((step, index) => (
                <Link
                  key={index}
                  to={step.link}
                  className={`flex-1 text-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    step.primary
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-secondary-700'
                  }`}
                >
                  {step.text}
                </Link>
              ))}
            </div>

            {/* Additional Actions */}
            {type === 'entradas' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-secondary-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </button>
                  <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-secondary-700 hover:bg-gray-50 transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    Reenviar por email
                  </button>
                </div>
              </div>
            )}

            {type === 'socio' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-primary-50 rounded-lg p-4">
                  <h4 className="font-semibold text-primary-900 mb-2">Tu número de socio:</h4>
                  <div className="text-2xl font-bold text-primary-600">#{id?.slice(-4).padStart(4, '0')}</div>
                  <p className="text-sm text-primary-700 mt-2">
                    Guarda este número, lo necesitarás para acceder a los beneficios de socio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;