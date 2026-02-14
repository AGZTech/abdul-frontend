import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';

export function CampaignSendingAnimation({
  isVisible
}: {
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
    >
      <motion.div
        className='relative w-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 shadow-2xl'
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        {/* Animated Background Circles */}
        <div className='absolute inset-0 overflow-hidden'>
          <motion.div
            className='absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-200/30'
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          <motion.div
            className='absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-purple-200/30'
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
          />
        </div>

        {/* Flying Emails - Contained within card */}
        <div className='absolute inset-0 overflow-hidden rounded-2xl'>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute'
              initial={{
                x: Math.random() * 300,
                y: 450,
                rotate: Math.random() * 360,
                scale: 0.4 + Math.random() * 0.3
              }}
              animate={{
                y: -50,
                x: 50 + Math.random() * 200,
                rotate: 360 + Math.random() * 360
              }}
              transition={{
                duration: 2 + Math.random() * 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear'
              }}
            >
              <Mail
                className='text-blue-500'
                size={16 + Math.random() * 12}
                fill='currentColor'
                fillOpacity={0.3}
              />
            </motion.div>
          ))}
        </div>

        {/* Central Content */}
        <div className='relative z-10 flex flex-col items-center gap-4'>
          {/* Main Icon with Pulse */}
          <motion.div
            className='relative'
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <motion.div
              className='absolute inset-0 rounded-full bg-blue-500/20'
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
            <div className='relative rounded-full bg-white p-6 shadow-xl'>
              <Send className='h-12 w-12 text-blue-600' />
            </div>
          </motion.div>

          {/* Text Content */}
          <div className='text-center'>
            <motion.h2
              className='text-2xl font-bold text-gray-800'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sending Campaign
            </motion.h2>
            <motion.p
              className='mt-1 text-sm text-gray-600'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Your emails are on their way...
            </motion.p>
          </div>

          {/* Animated Progress Dots */}
          <div className='flex gap-2'>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className='h-2.5 w-2.5 rounded-full bg-blue-600'
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Stats Animation */}
          <motion.div
            className='mt-2 flex gap-6 rounded-xl bg-white/80 px-6 py-3 shadow-lg backdrop-blur-sm'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className='text-center'>
              <motion.div
                className='text-xl font-bold text-blue-600'
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Mail className='mx-auto h-6 w-6' />
              </motion.div>
              <p className='mt-1 text-xs text-gray-600'>Processing</p>
            </div>
            <div className='text-center'>
              <motion.div
                className='text-xl font-bold text-purple-600'
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <Send className='mx-auto h-6 w-6' />
              </motion.div>
              <p className='mt-1 text-xs text-gray-600'>Sending</p>
            </div>
          </motion.div>
        </div>

        {/* Sparkles Effect - Contained */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className='absolute h-1 w-1 rounded-full bg-yellow-400'
            initial={{
              x: Math.random() * 400,
              y: Math.random() * 350,
              scale: 0
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
