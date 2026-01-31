import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight, Loader, Trophy } from 'lucide-react';
import { classificationService, ClassificationTeam } from '../services/classificationService';

interface StandingsWidgetProps {
  showCount?: number;
  highlightTeam?: string;
}

const StandingsWidget: React.FC<StandingsWidgetProps> = ({ 
  showCount = 5,
  highlightTeam = 'union'
}) => {
  const [standings, setStandings] = useState<ClassificationTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [ourPosition, setOurPosition] = useState<number | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const data = await classificationService.getClassification();
        
        // Find our team's position
        const ourTeamIndex = data.findIndex(team => 
          team.team.toLowerCase().includes(highlightTeam)
        );
        
        if (ourTeamIndex !== -1) {
          setOurPosition(data[ourTeamIndex].position);
          
          // Get teams around our position for better context
          const startIdx = Math.max(0, ourTeamIndex - 2);
          const endIdx = Math.min(data.length, startIdx + showCount);
          setStandings(data.slice(startIdx, endIdx));
        } else {
          // Just show top teams
          setStandings(data.slice(0, showCount));
        }
      } catch (error) {
        console.error('Error fetching standings:', error);
        // Use fallback data
        setStandings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [showCount, highlightTeam]);

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'G': return 'bg-green-500';
      case 'E': return 'bg-yellow-500';
      case 'P': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const isOurTeam = (teamName: string) => {
    return teamName.toLowerCase().includes(highlightTeam);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-48">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-bold text-secondary-900">Clasificación</h3>
        </div>
        <p className="text-secondary-600 text-center py-8">
          Datos no disponibles
        </p>
        <Link
          to="/clasificacion"
          className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold"
        >
          Ver clasificación completa
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Clasificación</h3>
              <p className="text-primary-100 text-sm">Segunda Regional B</p>
            </div>
          </div>
          {ourPosition && (
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{ourPosition}º</div>
              <div className="text-xs text-primary-100">Posición</div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-secondary-500 uppercase">
              <th className="text-left pb-3 w-8">#</th>
              <th className="text-left pb-3">Equipo</th>
              <th className="text-center pb-3 w-12">PJ</th>
              <th className="text-center pb-3 w-12">Pts</th>
              <th className="text-center pb-3 w-20 hidden sm:table-cell">Forma</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team) => (
              <tr 
                key={team.team}
                className={`border-t border-gray-100 ${
                  isOurTeam(team.team) 
                    ? 'bg-primary-50 font-semibold' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    team.isPromoted ? 'bg-green-500 text-white' :
                    team.isPlayoff ? 'bg-yellow-500 text-white' :
                    team.isRelegated ? 'bg-red-500 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {team.position}
                  </span>
                </td>
                <td className={`py-3 ${isOurTeam(team.team) ? 'text-primary-700' : 'text-secondary-900'}`}>
                  <span className="line-clamp-1">{team.team}</span>
                </td>
                <td className="py-3 text-center text-secondary-600 text-sm">
                  {team.played}
                </td>
                <td className={`py-3 text-center font-bold text-lg ${
                  isOurTeam(team.team) ? 'text-primary-600' : 'text-secondary-900'
                }`}>
                  {team.points}
                </td>
                <td className="py-3 hidden sm:table-cell">
                  <div className="flex justify-center space-x-1">
                    {team.lastFiveResults.slice(-5).map((result, idx) => (
                      <span
                        key={idx}
                        className={`w-5 h-5 rounded-full ${getResultBadge(result)} text-white text-xs flex items-center justify-center font-bold`}
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        <Link
          to="/clasificacion"
          className="flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
        >
          Ver clasificación completa
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default StandingsWidget;
