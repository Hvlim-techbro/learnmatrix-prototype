import { useQuery } from '@tanstack/react-query';
import { Cohort, User } from '@shared/schema';
import { motion } from 'framer-motion';
import { MessageSquare, CircleHelp } from 'lucide-react';
import { getTierColor } from '@/lib/gamification';

export default function CohortEngine() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const { data: cohort } = useQuery<Cohort>({
    queryKey: ['/api/user/cohort'],
  });
  
  // Cohort members (example data)
  const cohortMembers = [
    { initials: user?.avatarInitials || 'JS', color: 'primary', isCurrentUser: true },
    { initials: 'AT', color: 'accent-purple', isCurrentUser: false },
    { initials: 'RJ', color: 'accent-green', isCurrentUser: false },
    { initials: 'MK', color: 'accent-blue', isCurrentUser: false },
  ];
  
  // Recent activity (example data)
  const recentActivity = [
    { 
      user: { 
        initials: 'AT', 
        name: 'AlexT', 
        color: 'accent-purple' 
      }, 
      time: '2h ago', 
      activity: 'Shared notes on backpropagation algorithm' 
    },
    { 
      user: { 
        initials: 'RJ', 
        name: 'RachelJ', 
        color: 'accent-green' 
      }, 
      time: '5h ago', 
      activity: 'Asked a question about gradient descent optimization' 
    },
    { 
      user: { 
        initials: user?.avatarInitials || 'JS', 
        name: 'You', 
        color: 'primary' 
      }, 
      time: '8h ago', 
      activity: 'Completed "Neural Networks Fundamentals" quiz with 92% score' 
    },
  ];
  
  const tierColor = getTierColor(cohort?.tier || 'Scholar Circle');
  
  return (
    <div className="p-6 bg-black min-h-[calc(100vh-8rem)]">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-white">Cohort Engine</h2>
        <p className="text-[#888]">Learn together with your peers</p>
      </motion.div>
      
      {/* Your Cohort */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] rounded-xl p-6 shadow-md border border-[#222] mb-6 relative overflow-hidden"
        whileHover={{ borderColor: '#333', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-green opacity-5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-xl"></div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 relative z-10">
          <h3 className="font-semibold text-white mb-2 md:mb-0">
            Your Cohort: <span className="text-primary">{cohort?.name || 'AI Enthusiasts'}</span>
          </h3>
          <motion.span 
            className={`bg-gradient-${tierColor.toLowerCase()} text-white rounded-full px-3 py-1.5 text-xs font-medium shadow-sm self-start md:self-auto`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cohort?.tier || 'Scholar Circle'}
          </motion.span>
        </div>
        
        <p className="text-sm text-[#888] mb-5 relative z-10">{cohort?.description || 'A group of learners focused on artificial intelligence and machine learning'}</p>
        
        <div className="flex mb-5 relative z-10">
          {cohortMembers.map((member, index) => (
            <motion.div 
              key={index} 
              className={`${member.color === 'primary' ? 'bg-gradient-primary' : 
                member.color === 'accent-purple' ? 'bg-gradient-purple' : 
                member.color === 'accent-green' ? 'bg-gradient-green' : 
                member.color === 'accent-blue' ? 'bg-gradient-blue' : 
                'bg-gradient-primary'} 
                w-10 h-10 rounded-full border-2 border-black text-white flex items-center justify-center text-xs font-medium mr-2 shadow-md`}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {member.initials}
            </motion.div>
          ))}
          
          {cohort && cohort.memberCount > cohortMembers.length && (
            <motion.div 
              className="bg-gradient-secondary w-10 h-10 rounded-full border-2 border-black text-white flex items-center justify-center text-xs font-medium shadow-md"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: cohortMembers.length * 0.1 }}
            >
              +{cohort.memberCount - cohortMembers.length}
            </motion.div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <motion.button 
            className="bg-gradient-primary flex-1 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center shadow-md"
            whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)' }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Chat
          </motion.button>
          <motion.button 
            className="bg-[#222] flex-1 text-white border border-[#333] rounded-lg py-2.5 text-sm font-medium flex items-center justify-center"
            whileHover={{ scale: 1.03, backgroundColor: '#333', borderColor: '#444' }}
            whileTap={{ scale: 0.97 }}
          >
            <CircleHelp className="h-4 w-4 mr-2" /> Details
          </motion.button>
        </div>
      </motion.div>
      
      {/* Cohort Challenges */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="font-semibold mb-4 text-white">Cohort Challenges</h3>
        <motion.div 
          className="bg-[#111] rounded-xl p-6 shadow-md border border-[#222] relative overflow-hidden"
          whileHover={{ borderColor: '#333', y: -3 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Background glow */}
          <div className="absolute -top-5 right-0 w-20 h-20 bg-gradient-green opacity-10 rounded-full blur-lg"></div>
          
          <h4 className="font-medium mb-3 text-white relative z-10">Group Challenge: Neural Net Masters</h4>
          <p className="text-sm text-[#888] mb-4 relative z-10">Complete 10 lessons on neural networks as a group</p>
          
          <div className="mb-4 relative z-10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Progress: 7/10</span>
              <span className="text-green-400">70%</span>
            </div>
            <div className="h-3 bg-[#222] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              ></motion.div>
            </div>
          </div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="text-xs text-[#888]">2 days left</div>
            <div className="text-xs font-medium text-green-400">Reward: +Cohort XP Boost</div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="font-semibold mb-4 text-white">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="bg-[#111] rounded-xl p-5 shadow-md border border-[#222]"
              whileHover={{ y: -5, borderColor: '#333', backgroundColor: '#161616' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start">
                <motion.div 
                  className={`w-10 h-10 rounded-full ${item.user.color === 'primary' ? 'bg-gradient-primary' : 
                    item.user.color === 'accent-purple' ? 'bg-gradient-purple' : 
                    item.user.color === 'accent-green' ? 'bg-gradient-green' : 
                    'bg-gradient-blue'} 
                    text-white flex items-center justify-center text-xs font-medium mr-4 shadow-md`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.user.initials}
                </motion.div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-1">
                    <span className="font-medium text-white mr-2">{item.user.name}</span>
                    <span className="text-xs text-[#888]">{item.time}</span>
                  </div>
                  <p className="text-sm text-[#aaa]">{item.activity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
