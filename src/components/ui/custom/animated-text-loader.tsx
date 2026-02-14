'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const loadingTexts = [
  'Checking data integrity',
  'Validating email formats',
  'Filtering out invalid entries',
  'Ensuring everything looks good',
  'Finalizing validation report'
];

export default function AnimatedLoadingText() {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      key={loadingTexts[index]}
      className='min-h-[1.75rem] justify-center text-center text-lg font-medium transition-all duration-300 ease-in-out'
    >
      <AnimatePresence mode='wait'>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className='text-sm font-medium text-gray-800'
        >
          {loadingTexts[index]}
        </motion.span>
      </AnimatePresence>
    </p>
  );
}
