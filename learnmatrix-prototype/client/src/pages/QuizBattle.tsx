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
    <div className="p-6 bg-black min-h-[calc(100vh-8rem)]">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-white">Quiz Battle Arena</h2>
        <p className="text-[#888]">Test your knowledge against others</p>
      </motion.div>
      
      {/* Battle Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] rounded-xl p-6 shadow-md border border-[#222] mb-6 relative overflow-hidden"
        whileHover={{ borderColor: '#333', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      >
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-yellow opacity-5 rounded-full blur-xl"></div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-5 relative z-10">
          <h3 className="font-semibold text-white mb-2 sm:mb-0">Your Battle Stats</h3>
          <motion.span 
            className="bg-gradient-yellow text-white rounded-full px-4 py-1.5 text-xs font-medium shadow-md self-start sm:self-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Rank: {rank}
          </motion.span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-yellow mb-1">{battleStats.won}</div>
            <div className="text-xs text-[#888]">Battles Won</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-[#aaa] mb-1">{battleStats.lost}</div>
            <div className="text-xs text-[#888]">Battles Lost</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-primary mb-1">{battleStats.winRate}</div>
            <div className="text-xs text-[#888]">Win Rate</div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Battle Options */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4 mb-8"
      >
        <motion.button 
          className="bg-gradient-yellow w-full text-white rounded-xl py-4 font-semibold flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="h-5 w-5 mr-3" /> Quick Match
        </motion.button>
        
        <motion.button 
          className="bg-gradient-primary w-full text-white rounded-xl py-4 font-semibold flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' }}
          whileTap={{ scale: 0.98 }}
        >
          <Trophy className="h-5 w-5 mr-3" /> Ranked Match
        </motion.button>
        
        <motion.button 
          className="bg-[#161616] w-full text-white border border-[#333] rounded-xl py-4 font-semibold flex items-center justify-center"
          whileHover={{ scale: 1.02, backgroundColor: '#222', borderColor: '#444' }}
          whileTap={{ scale: 0.98 }}
        >
          <Users className="h-5 w-5 mr-3" /> Challenge Cohort
        </motion.button>
      </motion.div>
      
      {/* Leaderboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Leaderboard</h3>
          <motion.a 
            href="#" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            See Full
          </motion.a>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-[#111] rounded-xl shadow-md border border-[#222] overflow-hidden"
          whileHover={{ borderColor: '#333' }}
        >
          <div className="p-4 border-b border-[#222] flex items-center">
            <div className="w-8 text-center font-medium text-[#888]">#</div>
            <div className="flex-1 font-medium text-white">Player</div>
            <div className="w-16 text-center font-medium text-[#888]">Wins</div>
          </div>
          
          <div className="divide-y divide-[#222]">
            {leaderboard.map((player, index) => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className={`p-4 flex items-center ${player.isCurrentUser ? 'bg-[#181818]' : ''}`}
                whileHover={{ backgroundColor: player.isCurrentUser ? '#181818' : '#161616' }}
              >
                <div className="w-8 text-center font-bold text-white">{index + 1}</div>
                <div className="flex-1 flex items-center">
                  <motion.div 
                    className={`w-10 h-10 rounded-full ${player.color === 'primary' ? 'bg-gradient-primary' : 
                      player.color === 'accent-purple' ? 'bg-gradient-purple' : 
                      player.color === 'accent-green' ? 'bg-gradient-green' : 
                      player.color === 'accent-blue' ? 'bg-gradient-blue' : 
                      'bg-gradient-primary'} 
                      text-white flex items-center justify-center text-xs font-medium mr-3 shadow-md`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {player.initials}
                  </motion.div>
                  <span className="text-white">{player.name}</span>
                </div>
                <div className="w-16 text-center font-bold text-white">{player.wins}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
