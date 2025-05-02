import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { motion } from 'framer-motion';
import { Zap, Trophy, Users } from 'lucide-react';
import { getQuizRank } from '@/lib/gamification';

export default function QuizBattle() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  // Placeholder quiz battle stats
  const battleStats = {
    won: 15,
    lost: 8,
    winRate: '65%'
  };
  
  // Leaderboard data
  const leaderboard = [
    { id: 1, name: 'AlexT', wins: 32, initials: 'AT', color: 'accent-purple', isCurrentUser: false },
    { id: 2, name: 'RachelJ', wins: 28, initials: 'RJ', color: 'accent-green', isCurrentUser: false },
    { id: 3, name: 'MikeK', wins: 24, initials: 'MK', color: 'accent-blue', isCurrentUser: false },
    { id: 4, name: 'You', wins: 15, initials: user?.avatarInitials || 'JS', color: 'primary', isCurrentUser: true }
  ];
  
  const rank = getQuizRank(battleStats.won);
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Quiz Battle Arena</h2>
        <p className="text-neutral-darker">Test your knowledge against others</p>
      </div>
      
      {/* Battle Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-neutral mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Your Battle Stats</h3>
          <span className="bg-accent-yellow text-white rounded-full px-3 py-1 text-xs font-medium">Rank: {rank}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{battleStats.won}</div>
            <div className="text-xs text-neutral-darker">Battles Won</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{battleStats.lost}</div>
            <div className="text-xs text-neutral-darker">Battles Lost</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{battleStats.winRate}</div>
            <div className="text-xs text-neutral-darker">Win Rate</div>
          </div>
        </div>
      </motion.div>
      
      {/* Battle Options */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4 mb-6"
      >
        <button className="bg-secondary w-full text-white rounded-xl py-4 font-semibold flex items-center justify-center">
          <Zap className="h-5 w-5 mr-2" /> Quick Match
        </button>
        
        <button className="bg-primary w-full text-white rounded-xl py-4 font-semibold flex items-center justify-center">
          <Trophy className="h-5 w-5 mr-2" /> Ranked Match
        </button>
        
        <button className="bg-white w-full text-neutral-darker border border-neutral rounded-xl py-4 font-semibold flex items-center justify-center">
          <Users className="h-5 w-5 mr-2" /> Challenge Cohort
        </button>
      </motion.div>
      
      {/* Leaderboard Preview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Leaderboard</h3>
          <a href="#" className="text-sm text-primary">See Full</a>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral overflow-hidden"
        >
          <div className="p-4 border-b border-neutral flex items-center">
            <div className="w-8 text-center font-medium text-neutral-darker">#</div>
            <div className="flex-1 font-medium">Player</div>
            <div className="w-16 text-center font-medium">Wins</div>
          </div>
          
          <div className="divide-y divide-neutral">
            {leaderboard.map((player, index) => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className={`p-4 flex items-center ${player.isCurrentUser ? 'bg-primary-light bg-opacity-10' : ''}`}
              >
                <div className="w-8 text-center font-bold">{index + 1}</div>
                <div className="flex-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full bg-${player.color} text-white flex items-center justify-center text-xs mr-2`}>
                    {player.initials}
                  </div>
                  <span>{player.name}</span>
                </div>
                <div className="w-16 text-center font-bold">{player.wins}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
