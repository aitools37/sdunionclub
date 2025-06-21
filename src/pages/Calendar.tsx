import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Trophy, Users, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState('todos');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const teams = [
    { id: 'todos', name: 'Todos los equipos' },
    { id: 'primer-equipo', name: 'Primer Equipo' },
    { id: 'marismas', name: 'Marismas' },
    { id: 'juvenil', name: 'Juvenil' },
    { id: 'cadete', name: 'Cadete' },
    { id: 'infantil', name: 'Infantil' },
  ];

  const matches = [
    {
      id: 1,
      team: 'primer-equipo',
      teamName: 'Primer Equipo',
      opponent: 'CD Laredo',
      date: '2024-03-15',
      time: '17:00',
      venue: 'Campos de Sport La Planchada',
      competition: 'Segunda Regional',
      type: 'home',
      result: null,
    },
    {
      id: 2,
      team: 'primer-equipo',
      teamName: 'Primer Equipo',
      opponent: 'UD Samano',
      date: '2024-03-22',
      time: '16:30',
      venue: 'Campo Municipal Samano',
      competition: 'Segunda Regional',
      type: 'away',
      result: null,
    },
    {
      id: 3,
      team: 'primer-equipo',
      teamName: 'Primer Equipo',
      opponent: 'Real Racing Santander B',
      date: '2024-03-29',
      time: '18:00',
      venue: 'Campos de Sport La Planchada',
      competition: 'Segunda Regional',
      type: 'home',
      result: null,
    },
    {
      id: 4,
      team: 'marismas',
      teamName: 'Marismas',
      opponent: 'CD Bezana',
      date: '2024-03-16',
      time: '11:00',
      venue: 'Campos de Sport La Planchada',
      competition: 'Tercera Regional',
      type: 'home',
      result: null,
    },
    {
      id: 5,
      team: 'juvenil',
      teamName: 'Juvenil',
      opponent: 'Escuela Maliaño',
      date: '2024-03-17',
      time: '10:00',
      venue: 'Campo Municipal Maliaño',
      competition: 'Liga Juvenil',
      type: 'away',
      result: null,
    },
    // Past matches with results
    {
      id: 6,
      team: 'primer-equipo',
      teamName: 'Primer Equipo',
      opponent: 'SD Cayon',
      date: '2024-03-08',
      time: '17:00',
      venue: 'Campos de Sport La Planchada',
      competition: 'Segunda Regional',
      type: 'home',
      result: '2-1',
    },
    {
      id: 7,
      team: 'primer-equipo',
      teamName: 'Primer Equipo',
      opponent: 'CD Revilla',
      date: '2024-03-01',
      time: '16:00',
      venue: 'Campo Municipal Revilla',
      competition: 'Segunda Regional',
      type: 'away',
      result: '1-3',
    },
  ];

  const filteredMatches = selectedTeam === 'todos' 
    ? matches 
    : matches.filter(match => match.team === selectedTeam);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMatchesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredMatches.filter(match => match.date === dateStr);
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const upcomingMatches = filteredMatches
    .filter(match => new Date(match.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentMatches = filteredMatches
    .filter(match => new Date(match.date) < new Date() && match.result)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-900 mb-4">Calendario</h1>
            <p className="text-lg text-secondary-600">
              Todos los partidos y eventos del S.D. Unión Club de Astillero
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-secondary-600 mr-2" />
                <span className="font-medium text-secondary-900">Filtrar por equipo:</span>
              </div>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-2 inline" />
                Calendario
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'calendar' ? (
          /* Calendar View */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-secondary-600" />
              </button>
              
              <h2 className="text-xl font-bold text-secondary-900">
                {format(currentDate, 'MMMM yyyy', { locale: es })}
              </h2>
              
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-secondary-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Day headers */}
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-secondary-600">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map(day => {
                const dayMatches = getMatchesForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`bg-white p-2 min-h-[100px] ${
                      !isCurrentMonth ? 'opacity-50' : ''
                    } ${isToday(day) ? 'bg-primary-50' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday(day) ? 'text-primary-600' : 'text-secondary-900'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayMatches.slice(0, 2).map(match => (
                        <div
                          key={match.id}
                          className={`text-xs p-1 rounded text-white ${
                            match.type === 'home' ? 'bg-primary-600' : 'bg-secondary-600'
                          }`}
                        >
                          <div className="font-medium truncate">
                            vs {match.opponent}
                          </div>
                          <div>{match.time}</div>
                        </div>
                      ))}
                      {dayMatches.length > 2 && (
                        <div className="text-xs text-secondary-500">
                          +{dayMatches.length - 2} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-8">
            {/* Upcoming Matches */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-primary-600" />
                Próximos Partidos
              </h2>
              
              <div className="space-y-4">
                {upcomingMatches.map(match => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.type === 'home' 
                              ? 'bg-primary-100 text-primary-600' 
                              : 'bg-secondary-100 text-secondary-600'
                          }`}>
                            {match.type === 'home' ? 'Local' : 'Visitante'}
                          </span>
                          <span className="text-sm text-secondary-500">{match.competition}</span>
                        </div>
                        
                        <div className="text-lg font-semibold text-secondary-900 mb-2">
                          {match.teamName} vs {match.opponent}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm text-secondary-600">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {format(new Date(match.date), 'EEEE, d MMMM', { locale: es })}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {match.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {match.venue}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0">
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-secondary-600" />
                Resultados Recientes
              </h2>
              
              <div className="space-y-4">
                {recentMatches.map(match => (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            match.type === 'home' 
                              ? 'bg-primary-100 text-primary-600' 
                              : 'bg-secondary-100 text-secondary-600'
                          }`}>
                            {match.type === 'home' ? 'Local' : 'Visitante'}
                          </span>
                          <span className="text-sm text-secondary-500">{match.competition}</span>
                        </div>
                        
                        <div className="text-lg font-semibold text-secondary-900 mb-2">
                          {match.teamName} vs {match.opponent}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm text-secondary-600">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {format(new Date(match.date), 'EEEE, d MMMM', { locale: es })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {match.venue}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0">
                        <div className="text-2xl font-bold text-secondary-900">
                          {match.result}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;