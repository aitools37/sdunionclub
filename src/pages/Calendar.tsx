import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Trophy, Users, Filter, 
  ChevronLeft, ChevronRight, Loader, RefreshCw, ExternalLink, Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { calendarService, MatchDisplay } from '../services/calendarService';
import MatchCard from '../components/MatchCard';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState('todos');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [matches, setMatches] = useState<MatchDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const teams = [
    { id: 'todos', name: 'Todos los equipos' },
    { id: 'primer-equipo', name: 'Primer Equipo' },
    { id: 'marismas', name: 'Marismas' },
    { id: 'juvenil', name: 'Juvenil' },
    { id: 'cadete', name: 'Cadete' },
  ];

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const [upcoming, past] = await Promise.all([
        calendarService.getUpcomingMatches(10),
        calendarService.getPastMatches(10)
      ]);
      
      setMatches([...past.reverse(), ...upcoming]);
      
      const lastUpdate = await calendarService.getLastUpdateTime();
      setLastUpdated(lastUpdate);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await calendarService.triggerScrape();
      await loadMatches();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = selectedTeam === 'todos' 
    ? matches 
    : matches.filter(match => match.competition.toLowerCase().includes(selectedTeam));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMatchesForDate = (date: Date) => {
    return filteredMatches.filter(match => {
      const matchDate = new Date(match.date);
      return isSameDay(matchDate, date);
    });
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const upcomingMatches = filteredMatches
    .filter(match => new Date(match.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastMatches = filteredMatches
    .filter(match => new Date(match.date) < new Date() && match.result)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pad calendar to start on Monday
  const firstDayOfMonth = monthStart.getDay();
  const paddingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CalendarIcon className="w-10 h-10 text-primary-200 mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold">Calendario</h1>
            </div>
            <p className="text-lg text-primary-100 mb-4">
              Todos los partidos del S.D. Unión Club de Astillero
            </p>
            {lastUpdated && (
              <p className="text-sm text-primary-200">
                Última actualización: {lastUpdated.toLocaleDateString('es-ES')} a las {lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-secondary-600 mr-2" />
                <span className="font-medium text-secondary-900 mr-3">Filtrar:</span>
              </div>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Mes
                </button>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-secondary-600">Cargando calendario...</p>
          </div>
        ) : viewMode === 'calendar' ? (
          /* Calendar View */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-secondary-600" />
              </button>
              
              <h2 className="text-xl font-bold text-secondary-900 capitalize">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-2 sm:p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} className="p-2 text-center text-xs font-medium text-secondary-500 uppercase">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1">
                {/* Padding for start of month */}
                {Array.from({ length: paddingDays }).map((_, i) => (
                  <div key={`pad-${i}`} className="aspect-square p-1 bg-gray-50 rounded-lg" />
                ))}
                
                {/* Calendar days */}
                {calendarDays.map(day => {
                  const dayMatches = getMatchesForDate(day);
                  const hasMatch = dayMatches.length > 0;
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`aspect-square p-1 rounded-lg transition-colors ${
                        isToday(day) ? 'bg-primary-50 ring-2 ring-primary-500' : 
                        hasMatch ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-primary-600' : 'text-secondary-900'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      
                      {dayMatches.slice(0, 2).map((match, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-1 rounded mb-1 truncate ${
                            match.isHome 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-secondary-600 text-white'
                          }`}
                          title={`vs ${match.opponent}`}
                        >
                          vs {match.opponent.split(' ').slice(-1)[0]}
                        </div>
                      ))}
                      {dayMatches.length > 2 && (
                        <div className="text-xs text-secondary-500">
                          +{dayMatches.length - 2}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 border-t flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary-600 rounded mr-2" />
                <span className="text-secondary-600">Partido en casa</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-secondary-600 rounded mr-2" />
                <span className="text-secondary-600">Partido fuera</span>
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-white">
                <h2 className="text-xl font-bold text-secondary-900 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
                  Próximos Partidos
                </h2>
              </div>
              
              <div className="p-4 sm:p-6">
                {upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.slice(0, 5).map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MatchCard 
                          match={{
                            id: match.id,
                            opponent: match.opponent,
                            date: match.date,
                            time: match.time,
                            venue: match.venue,
                            competition: match.competition,
                            isHome: match.isHome
                          }} 
                          variant="default" 
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-secondary-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay partidos programados</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Results */}
            {pastMatches.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b bg-gradient-to-r from-secondary-50 to-white">
                  <h2 className="text-xl font-bold text-secondary-900 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Resultados Recientes
                  </h2>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {pastMatches.slice(0, 5).map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <MatchCard 
                          match={{
                            id: match.id,
                            opponent: match.opponent,
                            date: match.date,
                            time: match.time,
                            venue: match.venue,
                            competition: match.competition,
                            isHome: match.isHome,
                            result: match.result
                          }} 
                          variant="compact"
                          showTicketButton={false}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Competition Info */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-primary-600 mr-2" />
            Información de la Competición
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-2">Competición</h4>
              <p className="text-secondary-600">Segunda Regional Grupo C</p>
              <p className="text-secondary-500 text-sm">Temporada 2025-2026</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-2">Estadio</h4>
              <p className="text-secondary-600">La Planchada</p>
              <p className="text-secondary-500 text-sm">39610 El Astillero</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-secondary-900 mb-2">Datos RFCF</h4>
              <a
                href="https://www.rfcf.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                Ver en web oficial
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
