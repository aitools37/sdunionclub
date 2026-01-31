import React from 'react';
import { Trophy, Users, MapPin, Calendar, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface QuickStatsProps {
  position?: number;
  points?: number;
  nextMatch?: {
    opponent: string;
    date: string;
  };
  memberCount?: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({
  position = 3,
  points = 45,
  nextMatch,
  memberCount = 1250
}) => {
  const stats = [
    {
      icon: TrendingUp,
      value: `${position}º`,
      label: 'Posición',
      color: 'from-green-500 to-emerald-600',
      link: '/clasificacion'
    },
    {
      icon: Trophy,
      value: points.toString(),
      label: 'Puntos',
      color: 'from-yellow-500 to-orange-600',
      link: '/clasificacion'
    },
    {
      icon: Calendar,
      value: nextMatch ? new Date(nextMatch.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '-',
      label: 'Próximo partido',
      sublabel: nextMatch?.opponent,
      color: 'from-blue-500 to-indigo-600',
      link: '/calendario'
    },
    {
      icon: Users,
      value: memberCount.toLocaleString('es-ES'),
      label: 'Socios',
      color: 'from-primary-500 to-primary-700',
      link: '/hazte-socio'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-secondary-900 mb-6 flex items-center">
        <Award className="w-5 h-5 text-primary-600 mr-2" />
        Temporada 2025-2026
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={stat.link}
                className="block p-4 rounded-lg bg-gradient-to-br hover:shadow-md transition-all group"
                style={{
                  background: `linear-gradient(135deg, ${stat.color.split(' ')[0].replace('from-', '')} 0%, ${stat.color.split(' ')[1].replace('to-', '')} 100%)`
                }}
              >
                <div className={`bg-gradient-to-br ${stat.color} rounded-lg p-4 text-white h-full`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-6 h-6 opacity-80" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <div className="text-sm font-medium opacity-90">{stat.label}</div>
                  {stat.sublabel && (
                    <div className="text-xs opacity-75 mt-1 truncate">{stat.sublabel}</div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
