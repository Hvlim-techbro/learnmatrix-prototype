import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Apple, ArrowLeft, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future feature: handle signup/login logic here
    setLocation('/profile-setup');
  };

  const handleBack = () => {
    setLocation('/welcome');
  };

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#121212] relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <motion.button 
          className="p-2 text-white/70 hover:text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </motion.button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[24px] font-semibold text-white mb-6 text-center">
            {showLogin ? 'Welcome Back' : 'Join LearnMatrix'}
          </h1>
          
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-white/90 text-black w-full py-6 rounded-lg flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white hover:bg-white/90 text-black w-full py-6 rounded-lg flex items-center justify-center"
            >
              <Facebook className="h-5 w-5 mr-3 text-[#1877F2]" />
              Continue with Facebook
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white hover:bg-white/90 text-black w-full py-6 rounded-lg flex items-center justify-center"
            >
              <Apple className="h-5 w-5 mr-3" />
              Continue with Apple
            </Button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center justify-center my-6">
            <Separator className="w-1/3 bg-[#333]" />
            <span className="px-3 text-[14px] font-light text-[#555]">Or</span>
            <Separator className="w-1/3 bg-[#333]" />
          </div>
          
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1E1E1E] border-[#333] h-14 px-4 text-[#EEE] placeholder:text-[#777]"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1E1E1E] border-[#333] h-14 px-4 text-[#EEE] placeholder:text-[#777]"
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="bg-[#29B6F6] hover:bg-[#29B6F6]/90 text-white w-full py-6 rounded-lg mt-6"
            >
              {showLogin ? 'Log In' : 'Continue'}
            </Button>
          </form>
          
          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button 
              className="text-[#29B6F6] text-sm"
              onClick={toggleForm}
            >
              {showLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
          
          {/* Terms & Privacy */}
          <p className="text-[12px] font-light text-[#555] text-center mt-6">
            By continuing, you agree to our Terms & Privacy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
