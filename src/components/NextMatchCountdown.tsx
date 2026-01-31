import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Match {
  id: string;
  opponent: string;
  opponentLogo?: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  isHome: boolean;
}

interface NextMatchCountdownProps {
  match?: Match;
}

const NextMatchCountdown: React.FC<NextMatchCountdownProps> = ({ match }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Default match if none provided
  const defaultMatch: Match = {
    id: '1',
    opponent: 'Próximo rival',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '17:00',
    venue: 'La Planchada',
    competition: 'Segunda Regional',
    isHome: true
  };

  const currentMatch = match || defaultMatch;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const matchDateTime = new Date(`${currentMatch.date}T${currentMatch.time}:00`);
      const now = new Date();
      const difference = matchDateTime.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [currentMatch.date, currentMatch.time]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]"
      >
        <span className="text-3xl sm:text-5xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs sm:text-sm text-white/80 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-700 to-secondary-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundBlendMode: 'overlay'
          }}
        />
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255,255,255,0.03) 10px,
              rgba(255,255,255,0.03) 20px
            )`
          }} />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Match Info */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-white uppercase tracking-wider">
                {currentMatch.competition}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Próximo Partido
            </h2>

            {/* Teams Display */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-8 mb-8">
              {/* Home Team */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full p-2 shadow-lg">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/0/01/Uni%C3%B3n_Club_Astillero.png"
                    alt="S.D. Unión Club"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-white font-bold text-sm sm:text-base">
                  {currentMatch.isHome ? 'UCA' : currentMatch.opponent.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>

              {/* VS */}
              <div className="text-2xl sm:text-4xl font-bold text-white/60">VS</div>

              {/* Away Team */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/90 rounded-full p-3 shadow-lg flex items-center justify-center">
                  {currentMatch.opponentLogo ? (
                    <img
                      src={currentMatch.opponentLogo}
                      alt={currentMatch.opponent}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold text-gray-600">
                      {currentMatch.opponent.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-white font-bold text-sm sm:text-base">
                  {currentMatch.isHome ? currentMatch.opponent.split(' ').slice(0, 2).join(' ') : 'UCA'}
                </span>
              </div>
            </div>

            {/* Match Details */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-white/80 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm capitalize">{formatDate(currentMatch.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{currentMatch.time}h</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentMatch.venue}</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/entradas"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              <Ticket className="w-5 h-5" />
              <span>Comprar Entradas</span>
            </Link>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <h3 className="text-lg text-white/80 mb-6 font-medium uppercase tracking-wider">
              Cuenta Atrás
            </h3>
            
            <div className="flex justify-center space-x-3 sm:space-x-6">
              <TimeBlock value={timeLeft.days} label="Días" />
              <div className="text-3xl sm:text-5xl font-bold text-white/40 self-start pt-3 sm:pt-4">:</div>
              <TimeBlock value={timeLeft.hours} label="Horas" />
              <div className="text-3xl sm:text-5xl font-bold text-white/40 self-start pt-3 sm:pt-4">:</div>
              <TimeBlock value={timeLeft.minutes} label="Min" />
              <div className="hidden sm:block text-3xl sm:text-5xl font-bold text-white/40 self-start pt-3 sm:pt-4">:</div>
              <div className="hidden sm:block">
                <TimeBlock value={timeLeft.seconds} label="Seg" />
              </div>
            </div>

            {/* Live indicator for match day */}
            {timeLeft.days === 0 && timeLeft.hours < 2 && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-6 inline-flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-full"
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-bold uppercase">¡Día de partido!</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextMatchCountdown;
