import React, { useState, useEffect } from 'react';
import { User, Shield, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  playerService,
  Player,
  Staff,
  POSITION_LABELS,
  POSITION_SHORT,
} from '../services/playerService';

interface PlayerRosterProps {
  teamSlug: string;
}

const POSITION_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  POR: { bg: 'from-yellow-500 to-amber-600', text: 'text-yellow-600', accent: 'bg-yellow-500' },
  DEF: { bg: 'from-blue-500 to-blue-700', text: 'text-blue-600', accent: 'bg-blue-500' },
  MED: { bg: 'from-green-500 to-emerald-700', text: 'text-green-600', accent: 'bg-green-500' },
  DEL: { bg: 'from-red-500 to-red-700', text: 'text-red-600', accent: 'bg-red-500' },
  '': { bg: 'from-secondary-500 to-secondary-700', text: 'text-secondary-600', accent: 'bg-secondary-500' },
};

const PlayerCard: React.FC<{ player: Player; index: number }> = ({ player, index }) => {
  const colors = POSITION_COLORS[player.position] || POSITION_COLORS[''];
  const initials = player.display_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className={`h-1.5 bg-gradient-to-r ${colors.bg}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
            <span className="text-white font-bold text-lg">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {player.shirt_number && (
                <span className={`text-2xl font-black ${colors.text} opacity-80 leading-none`}>
                  {player.shirt_number}
                </span>
              )}
              <h3 className="font-bold text-secondary-900 text-base leading-tight truncate">
                {player.display_name}
              </h3>
            </div>

            {player.position && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colors.accent} text-white`}>
                {POSITION_SHORT[player.position]}
              </span>
            )}

            {player.last_name && (
              <p className="text-xs text-secondary-400 mt-1 truncate">
                {player.first_name} {player.last_name}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StaffCard: React.FC<{ member: Staff; index: number }> = ({ member, index }) => {
  const initials = member.display_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-600 to-secondary-800 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
      <div>
        <h4 className="font-bold text-secondary-900">{member.display_name}</h4>
        <p className="text-sm text-primary-600 font-medium">{member.role}</p>
      </div>
    </motion.div>
  );
};

const PlayerRoster: React.FC<PlayerRosterProps> = ({ teamSlug }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [playerData, staffData] = await Promise.all([
        playerService.getPlayers(teamSlug),
        playerService.getStaff(teamSlug),
      ]);
      setPlayers(playerData);
      setStaffMembers(staffData);
      setLoading(false);
    };
    loadData();
  }, [teamSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (players.length === 0 && staffMembers.length === 0) {
    return null;
  }

  const grouped = playerService.groupByPosition(players);
  const positionsAvailable = Object.keys(grouped);
  const namedPositions = positionsAvailable.filter(p => p !== '');
  const hasEnoughPositions = namedPositions.length >= 2;

  const filteredPlayers = activeFilter === 'all'
    ? players
    : players.filter(p => p.position === activeFilter);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Plantilla 2025/26</h2>
          <p className="text-sm text-secondary-500">{players.length} jugadores inscritos</p>
        </div>
      </div>

      {hasEnoughPositions && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-secondary-900 text-white shadow-md'
                : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
            }`}
          >
            Todos ({players.length})
          </button>
          {namedPositions.map(pos => {
            const colors = POSITION_COLORS[pos] || POSITION_COLORS[''];
            const label = POSITION_LABELS[pos] || pos;
            const count = grouped[pos]?.length || 0;
            return (
              <button
                key={pos}
                onClick={() => setActiveFilter(pos)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === pos
                    ? `${colors.accent} text-white shadow-md`
                    : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {hasEnoughPositions && activeFilter === 'all' ? (
        Object.entries(grouped).map(([pos, posPlayers]) => (
          <div key={pos} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-1 h-8 rounded-full ${POSITION_COLORS[pos]?.accent || 'bg-secondary-400'}`} />
              <h3 className="text-lg font-bold text-secondary-800">
                {POSITION_LABELS[pos] || 'Jugadores'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {posPlayers.map((player, idx) => (
                <PlayerCard key={player.id} player={player} index={idx} />
              ))}
            </div>
          </div>
        ))
      ) : hasEnoughPositions ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {filteredPlayers.map((player, idx) => (
            <PlayerCard key={player.id} player={player} index={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {players.map((player, idx) => (
            <PlayerCard key={player.id} player={player} index={idx} />
          ))}
        </div>
      )}

      {staffMembers.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-secondary-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900">Cuerpo Técnico</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffMembers.map((member, idx) => (
              <StaffCard key={member.id} member={member} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerRoster;
