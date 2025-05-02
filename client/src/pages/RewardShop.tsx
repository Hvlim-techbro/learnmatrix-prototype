import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { motion } from 'framer-motion';
import { Book, MicOff, IdCard, Rocket } from 'lucide-react';

export default function RewardShop() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });
  
  const [selectedCategory, setSelectedCategory] = useState('All Rewards');
  
  const categories = [
    'All Rewards',
    'Content Unlocks',
    'Personalization',
    'Recognition'
  ];
  
  // Reward items
  const rewards = [
    {
      id: 1,
      name: 'Advanced Neural Network Workshop',
      description: 'Unlock premium content with expert tutorials',
      icon: Book,
      color: 'accent-purple',
      price: 500,
      category: 'Content Unlocks'
    },
    {
      id: 2,
      name: 'New AI Tutor Voice Pack',
      description: 'Choose from 5 new voice styles for your AI tutors',
      icon: MicOff,
      color: 'accent-blue',
      price: 350,
      category: 'Personalization'
    },
    {
      id: 3,
      name: 'Exclusive "Early Adopter" Badge',
      description: 'Limited edition badge for your profile',
      icon: IdCard,
      color: 'accent-yellow',
      price: 200,
      category: 'Recognition'
    },
    {
      id: 4,
      name: '1-Week BEYOND Feature Access',
      description: 'Unlock premium research tools for a week',
      icon: Rocket,
      color: 'accent-green',
      price: 750,
      category: 'Content Unlocks'
    }
  ];
  
  // Filter rewards by selected category
  const filteredRewards = selectedCategory === 'All Rewards'
    ? rewards
    : rewards.filter(reward => reward.category === selectedCategory);
  
  return (
    <div className="p-6 bg-black min-h-[calc(100vh-8rem)]">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-white">Reward Shop</h2>
        <p className="text-[#888]">Spend your XP on exclusive rewards</p>
      </motion.div>
      
      {/* Available Points */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#111] rounded-xl p-6 shadow-md border border-[#222] mb-6 overflow-hidden relative"
        whileHover={{ borderColor: '#333' }}
      >
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-lg"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-primary opacity-30"></div>
        
        <h3 className="font-semibold mb-3 text-white relative z-10">Your Balance</h3>
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-primary relative z-10">
          {user?.xp || 1250} XP
        </div>
      </motion.div>
      
      {/* Reward Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 flex overflow-x-auto pb-2 -mx-1 hide-scrollbar"
      >
        {categories.map((category, index) => (
          <motion.button 
            key={index}
            className={`whitespace-nowrap mx-1 ${
              selectedCategory === category 
                ? 'bg-gradient-primary text-white shadow-lg' 
                : 'bg-[#111] text-[#888] border border-[#222] hover:bg-[#222] hover:text-white transition-colors'
            } rounded-full px-5 py-2.5 text-sm font-medium`}
            onClick={() => setSelectedCategory(category)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Rewards */}
      <div className="space-y-5">
        {filteredRewards.map((reward, index) => (
          <motion.div 
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="bg-[#111] rounded-xl p-5 shadow-md border border-[#222]"
            whileHover={{ y: -5, borderColor: '#333', backgroundColor: '#161616' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex flex-col sm:flex-row">
              <motion.div 
                className={`w-16 h-16 rounded-xl ${reward.color === 'accent-purple' ? 'bg-gradient-purple' : 
                  reward.color === 'accent-blue' ? 'bg-gradient-blue' : 
                  reward.color === 'accent-yellow' ? 'bg-gradient-yellow' : 
                  reward.color === 'accent-green' ? 'bg-gradient-green' : 
                  'bg-gradient-primary'} 
                text-white flex items-center justify-center shadow-lg mb-4 sm:mb-0 sm:mr-5`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 15px rgba(124, 58, 237, 0.3)', '0 0 0 rgba(0,0,0,0)'] 
                }}
                transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
              >
                <reward.icon className="h-8 w-8" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">{reward.name}</h4>
                <p className="text-sm text-[#888] mb-3">{reward.description}</p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="font-bold text-transparent bg-clip-text bg-gradient-primary">
                    {reward.price} XP
                  </div>
                  <motion.button 
                    className={`${(user?.xp || 0) >= reward.price ? 
                      'bg-gradient-primary hover:bg-gradient-primary/90' : 
                      'bg-[#222] text-[#666] cursor-not-allowed'} 
                      text-white rounded-lg px-4 py-2 text-sm font-medium`}
                    disabled={(user?.xp || 0) < reward.price}
                    whileHover={{ scale: (user?.xp || 0) >= reward.price ? 1.05 : 1 }}
                    whileTap={{ scale: (user?.xp || 0) >= reward.price ? 0.95 : 1 }}
                  >
                    {(user?.xp || 0) >= reward.price ? 'Unlock' : 'Not enough XP'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
