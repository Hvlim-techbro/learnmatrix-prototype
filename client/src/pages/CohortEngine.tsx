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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Cohort Engine</h2>
        <p className="text-neutral-darker">Learn together with your peers</p>
      </div>
      
      {/* Your Cohort */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-neutral mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Your Cohort: {cohort?.name || 'AI Enthusiasts'}</h3>
          <span className={`bg-${tierColor} text-white rounded-full px-3 py-1 text-xs font-medium`}>
            {cohort?.tier || 'Scholar Circle'}
          </span>
        </div>
        
        <p className="text-sm text-neutral-darker mb-4">{cohort?.description || 'A group of learners focused on artificial intelligence and machine learning'}</p>
        
        <div className="flex -space-x-2 mb-4">
          {cohortMembers.map((member, index) => (
            <div 
              key={index} 
              className={`w-8 h-8 rounded-full border-2 border-white bg-${member.color} text-white flex items-center justify-center text-xs`}
            >
              {member.initials}
            </div>
          ))}
          
          {cohort && cohort.memberCount > cohortMembers.length && (
            <div className={`w-8 h-8 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-xs`}>
              +{cohort.memberCount - cohortMembers.length}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button className="bg-primary flex-1 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center">
            <MessageSquare className="h-4 w-4 mr-1" /> Chat
          </button>
          <button className="bg-white flex-1 text-neutral-darker border border-neutral rounded-lg py-2 text-sm font-medium flex items-center justify-center">
            <CircleHelp className="h-4 w-4 mr-1" /> Details
          </button>
        </div>
      </motion.div>
      
      {/* Cohort Challenges */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="font-semibold mb-4">Cohort Challenges</h3>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-neutral">
          <h4 className="font-medium mb-3">Group Challenge: Neural Net Masters</h4>
          <p className="text-sm text-neutral-darker mb-3">Complete 10 lessons on neural networks as a group</p>
          
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress: 7/10</span>
              <span>70%</span>
            </div>
            <div className="h-2 bg-neutral-light rounded-full overflow-hidden">
              <div className="h-full bg-accent-green w-[70%] rounded-full transition-all duration-500 ease-out"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-neutral-darker">2 days left</div>
            <div className="text-xs font-medium text-primary">Reward: +Cohort XP Boost</div>
          </div>
        </div>
      </motion.div>
      
      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-neutral"
            >
              <div className="flex">
                <div className={`w-8 h-8 rounded-full bg-${item.user.color} text-white flex items-center justify-center text-xs mr-3`}>
                  {item.user.initials}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{item.user.name}</span>
                    <span className="text-xs text-neutral-darker">{item.time}</span>
                  </div>
                  <p className="text-sm mt-1">{item.activity}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
