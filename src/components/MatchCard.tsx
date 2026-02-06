import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Ticket, Trophy, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { OUR_TEAM_NAME, OUR_TEAM_LOGO, getOpponentLogo } from '../lib/team';

export interface MatchData {
  id: string | number;
  opponent: string;
  opponentLogo?: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  isHome: boolean;
  result?: string;
  homeScore?: number;
  awayScore?: number;
}

interface MatchCardProps {
  match: MatchData;
  variant?: 'default' | 'compact' | 'featured';
  showTicketButton?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  variant = 'default',
  showTicketButton = true 
}) => {
  const isPastMatch = new Date(match.date) < new Date();
  const isToday = new Date(match.date).toDateString() === new Date().toDateString();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getResultColor = () => {
    if (!match.result) return '';
    const [home, away] = match.result.split('-').map(Number);
    const ourScore = match.isHome ? home : away;
    const theirScore = match.isHome ? away : home;
    
    if (ourScore > theirScore) return 'bg-green-500';
    if (ourScore < theirScore) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-1 h-12 rounded-full ${match.isHome ? 'bg-primary-500' : 'bg-secondary-400'}`} />
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  match.isHome ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {match.isHome ? 'Local' : 'Visitante'}
                </span>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 animate-pulse">
                    HOY
                  </span>
                )}
              </div>
              <p className="font-semibold text-secondary-900">
                {match.isHome ? OUR_TEAM_NAME : match.opponent} vs {match.isHome ? match.opponent : OUR_TEAM_NAME}
              </p>
              <div className="flex items-center space-x-3 text-sm text-secondary-500 mt-1">
                <span className="capitalize">{formatDate(match.date)}</span>
                <span>•</span>
                <span>{match.time}h</span>
              </div>
            </div>
          </div>
          
          {isPastMatch && match.result ? (
            <div className={`${getResultColor()} text-white px-4 py-2 rounded-lg font-bold text-lg`}>
              {match.result}
            </div>
          ) : showTicketButton ? (
            <Link
              to="/entradas"
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Entradas</span>
            </Link>
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-xl overflow-hidden text-white"
      >
        <div className="p-6">
          {/* Competition Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary-100">
                {match.competition}
              </span>
            </div>
            {isToday && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 animate-pulse">
                HOY
              </span>
            )}
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-6">
            {/* Home */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg">
                {match.isHome ? (
                  <img src={OUR_TEAM_LOGO} alt={OUR_TEAM_NAME} className="w-full h-full object-contain" />
                ) : (match.opponentLogo || getOpponentLogo(match.opponent)) ? (
                  <img src={match.opponentLogo || getOpponentLogo(match.opponent)} alt={match.opponent} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                    {match.opponent.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-bold text-lg">
                {match.isHome ? OUR_TEAM_NAME : match.opponent}
              </span>
            </div>

            {/* Score or VS */}
            <div className="flex flex-col items-center px-6">
              {isPastMatch && match.result ? (
                <div className="text-4xl font-bold">{match.result}</div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white/60">VS</div>
                  <div className="text-sm text-primary-200 mt-2">{match.time}h</div>
                </>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg">
                {!match.isHome ? (
                  <img src={OUR_TEAM_LOGO} alt={OUR_TEAM_NAME} className="w-full h-full object-contain" />
                ) : (match.opponentLogo || getOpponentLogo(match.opponent)) ? (
                  <img src={match.opponentLogo || getOpponentLogo(match.opponent)} alt={match.opponent} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                    {match.opponent.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-bold text-lg">
                {!match.isHome ? OUR_TEAM_NAME : match.opponent}
              </span>
            </div>
          </div>

          {/* Match Info */}
          <div className="flex items-center justify-center space-x-4 text-primary-100 text-sm mb-6">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="capitalize">{formatDate(match.date)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{match.venue}</span>
            </div>
          </div>

          {/* CTA */}
          {!isPastMatch && showTicketButton && (
            <Link
              to="/entradas"
              className="flex items-center justify-center space-x-2 bg-white text-primary-600 w-full py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              <Ticket className="w-5 h-5" />
              <span>Comprar Entradas</span>
            </Link>
          )}
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-secondary-600">{match.competition}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          match.isHome ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {match.isHome ? 'Local' : 'Visitante'}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Teams Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 bg-gray-100 rounded-full p-1 flex-shrink-0">
              {match.isHome ? (
                <img src={OUR_TEAM_LOGO} alt={OUR_TEAM_NAME} className="w-full h-full object-contain" />
              ) : (match.opponentLogo || getOpponentLogo(match.opponent)) ? (
                <img src={(match.opponentLogo || getOpponentLogo(match.opponent))!} alt={match.opponent} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-400">
                  {match.opponent.charAt(0)}
                </div>
              )}
            </div>
            <span className="font-bold text-secondary-900">{match.isHome ? OUR_TEAM_NAME : match.opponent}</span>
          </div>

          <div className="px-4">
            {isPastMatch && match.result ? (
              <div className={`${getResultColor()} text-white px-4 py-2 rounded-lg font-bold text-xl`}>
                {match.result}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-300">VS</div>
                <div className="text-sm text-secondary-500">{match.time}h</div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 flex-1 justify-end">
            <span className="font-bold text-secondary-900 text-right">{match.isHome ? match.opponent : OUR_TEAM_NAME}</span>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              {match.isHome ? (
                (match.opponentLogo || getOpponentLogo(match.opponent)) ? (
                  <img src={(match.opponentLogo || getOpponentLogo(match.opponent))!} alt={match.opponent} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-xl font-bold text-gray-400">{match.opponent.charAt(0)}</span>
                )
              ) : (
                <img src={OUR_TEAM_LOGO} alt={OUR_TEAM_NAME} className="w-10 h-10 object-contain" />
              )}
            </div>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center justify-center space-x-4 text-sm text-secondary-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
        </div>

        {/* Button */}
        {!isPastMatch && showTicketButton && (
          <Link
            to="/entradas"
            className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white w-full py-3 rounded-lg font-semibold transition-colors"
          >
            <Ticket className="w-4 h-4" />
            <span>Comprar Entradas</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default MatchCard;
