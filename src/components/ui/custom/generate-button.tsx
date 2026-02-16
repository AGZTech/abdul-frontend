'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

const loadingTexts = [
  'Thinking 💭',
  'Designing email 🎨',
  'Adding magic ✨',
  'Painting gradients 🌈',
  'Almost ready 🚀'
];

export default function GenerateButton({
  isLoading,
  onClick
}: GenerateButtonProps) {

  const [index, setIndex] = useState(0);

  // ✅ Calculate longest text width
  const longestText = useMemo(() => {
    return loadingTexts.reduce((a, b) => (a.length > b.length ? a : b), '');
  }, [loadingTexts]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition-all hover:bg-blue-700 ${isLoading ? 'cursor-wait opacity-90' : ''
        }`}
      style={{ minWidth: '200px' }} // ✅ Keeps button width stable
    >
      {isLoading ? (
        <div className='flex items-center gap-2'>
          <Loader2 className='h-4 w-4 animate-spin text-white' />
          <div
            className='relative h-5 w-[140px] text-center'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AnimatePresence mode='wait'>
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className='absolute text-sm font-medium whitespace-nowrap'
              >
                {loadingTexts[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <span className='flex items-center gap-1 text-sm font-medium whitespace-nowrap'>
          ✨ Generate Template
        </span>
      )}
    </button>
  );
}
