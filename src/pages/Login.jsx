import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { BsDatabaseFill, BsPeopleFill, BsGearFill } from 'react-icons/bs';
import { supabase } from '../config/supabase';

const FloatingIcon = ({ icon: Icon, delay, x, y }) => (
  <motion.div
    className="absolute text-white/20"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      x: [x, x + 20, x],
      y: [y, y - 20, y],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "reverse"
    }}
  >
    <Icon size={30} />
  </motion.div>
);

const Login = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Check email verification status
      const { email_verified } = await userService.checkEmailVerification(data.user.id);
      
      if (!email_verified) {
        await userService.resendVerificationEmail(formData.email);
        setError('Please verify your email. A new verification link has been sent.');
        setIsLoading(false);
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(to bottom, ${theme.colors.primary.light}, ${theme.colors.background.secondary})` 
      }}
    >
      {/* Animated Background Elements */}
      <FloatingIcon icon={BsDatabaseFill} delay={0} x={100} y={100} />
      <FloatingIcon icon={BsPeopleFill} delay={1} x={200} y={300} />
      <FloatingIcon icon={BsGearFill} delay={0.5} x={800} y={200} />
      <FloatingIcon icon={BsDatabaseFill} delay={1.5} x={700} y={400} />
      <FloatingIcon icon={BsGearFill} delay={2} x={300} y={500} />

      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          className="mx-auto h-12 w-auto"
          src="/src/assets/images/crm-logo.svg"
          alt="CRM Logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        />
        <motion.h2 
          className="mt-6 text-center text-2xl font-semibold"
          style={{ color: theme.colors.text.primary }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Login to your account
        </motion.h2>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 relative">
          {/* Animated border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              background: `linear-gradient(90deg, ${theme.colors.primary.main}, ${theme.colors.primary.hover})`,
              padding: '1px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            }}
          />

          <form className="space-y-6 relative" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {error}
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Email ID <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                  style={{ 
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.border.main,
                    color: theme.colors.text.primary,
                    '&:focus': {
                      borderColor: theme.colors.primary.main,
                      ringColor: theme.colors.primary.light
                    }
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Password <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
                  style={{ 
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.border.main,
                    color: theme.colors.text.primary,
                    '&:focus': {
                      borderColor: theme.colors.primary.main,
                      ringColor: theme.colors.primary.light
                    }
                  }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  style={{ color: theme.colors.text.light }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium hover:opacity-80"
                  style={{ color: theme.colors.primary.main }}
                >
                  Forgot Password?
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                style={{ 
                  backgroundColor: theme.colors.primary.main,
                  '&:hover': {
                    backgroundColor: theme.colors.primary.hover
                  },
                  '&:focus': {
                    ringColor: theme.colors.primary.light
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⟳
                  </motion.div>
                ) : (
                  'Login'
                )}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
