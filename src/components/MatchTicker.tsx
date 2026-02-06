import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { calendarService, MatchDisplay } from '../services/calendarService';

const MatchTicker: React.FC = () => {
  const [matches, setMatches] = useState<MatchDisplay[]>([]);

  useEffect(() => {
    const load = async () => {
      const [upcoming, past] = await Promise.all([
        calendarService.getUpcomingMatches(4),
        calendarService.getPastMatches(2),
      ]);
      const combined = [
        ...past.map((m) => ({ ...m, _type: 'past' as const })),
        ...upcoming.map((m) => ({ ...m, _type: 'upcoming' as const })),
      ];
      setMatches(combined);
    };
    load();
  }, []);

  if (matches.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getResultColor = (result: string | undefined, isHome: boolean) => {
    if (!result) return '';
    const [home, away] = result.split('-').map(Number);
    const ourScore = isHome ? home : away;
    const theirScore = isHome ? away : home;
    if (ourScore > theirScore) return 'text-green-400';
    if (ourScore < theirScore) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-secondary-900 border-b border-secondary-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-12 overflow-x-auto no-scrollbar">
          <div className="flex-shrink-0 flex items-center space-x-2 pr-6 border-r border-secondary-700 mr-6">
            <Calendar className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap">Partidos</span>
          </div>

          <div className="flex items-center space-x-6">
            {matches.map((match) => {
              const isPast = new Date(match.date) < new Date();
              return (
                <div key={match.id} className="flex items-center space-x-3 whitespace-nowrap">
                  <span className="text-xs text-secondary-400 capitalize">{formatDate(match.date)}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${match.isHome ? 'text-white' : 'text-secondary-300'}`}>
                      {match.isHome ? 'UCA' : match.opponent.length > 12 ? match.opponent.slice(0, 12) + '...' : match.opponent}
                    </span>
                    {isPast && match.result ? (
                      <span className={`text-sm font-bold ${getResultColor(match.result, match.isHome)}`}>
                        {match.result}
                      </span>
                    ) : (
                      <span className="text-xs bg-secondary-800 text-secondary-300 px-2 py-0.5 rounded">
                        {match.time}h
                      </span>
                    )}
                    <span className={`text-sm font-semibold ${!match.isHome ? 'text-white' : 'text-secondary-300'}`}>
                      {!match.isHome ? 'UCA' : match.opponent.length > 12 ? match.opponent.slice(0, 12) + '...' : match.opponent}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-secondary-700 ml-3" />
                </div>
              );
            })}

            <Link
              to="/calendario"
              className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              <span>Ver todo</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchTicker;
