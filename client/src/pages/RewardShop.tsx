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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Reward Shop</h2>
        <p className="text-neutral-darker">Spend your XP on exclusive rewards</p>
      </div>
      
      {/* Available Points */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-neutral mb-6"
      >
        <h3 className="font-semibold mb-2">Your Balance</h3>
        <div className="text-3xl font-bold text-primary">{user?.xp || 1250} XP</div>
      </motion.div>
      
      {/* Reward Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-4 flex overflow-x-auto pb-2 -mx-1"
      >
        {categories.map((category, index) => (
          <motion.button 
            key={index}
            className={`whitespace-nowrap mx-1 ${
              selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-white text-neutral-darker border border-neutral'
            } rounded-full px-4 py-2 text-sm font-medium`}
            onClick={() => setSelectedCategory(category)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Rewards */}
      <div className="space-y-4">
        {filteredRewards.map((reward, index) => (
          <motion.div 
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-neutral"
          >
            <div className="flex">
              <div className={`w-16 h-16 rounded-xl bg-${reward.color} text-white flex items-center justify-center text-2xl mr-4`}>
                <reward.icon className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{reward.name}</h4>
                <p className="text-sm text-neutral-darker mb-2">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-primary">{reward.price} XP</div>
                  <button 
                    className="bg-primary text-white rounded-lg px-3 py-1 text-sm"
                    disabled={(user?.xp || 0) < reward.price}
                  >
                    {(user?.xp || 0) >= reward.price ? 'Unlock' : 'Not enough XP'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
