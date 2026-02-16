'use client';
import { TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function CompanyStatsCard() {
  return (
    <div className='dark:bg-card dark:border-border flex h-[200px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm'>
      {/* Top icon */}
      <div className='flex justify-start'>
        <div className=''>
          <Image
            src='/assets/breifcase.svg'
            className='dark:invert'
            alt='company'
            width={40}
            height={40}
          />
        </div>
      </div>

      {/* Center content */}
      <div>
        <h2 className='dark:text-foreground text-4xl font-semibold text-gray-900'>
          8,907
        </h2>
        <p className='mt-1 text-sm text-gray-500'>Total Companies</p>
      </div>

      {/* Bottom growth bar */}
      <div className='flex w-full items-center justify-center gap-2 rounded-tl-none rounded-tr-none rounded-br-[5px] rounded-bl-[10px] bg-gradient-to-r from-green-200 to-white px-3 py-2 text-center dark:from-gray-300'>
        <TrendingUp className='dark:text-ring h-4 w-4 text-green-500' />
        <span className='dark:text-background text-sm font-medium text-green-600'>
          3.4 %
        </span>
      </div>
    </div>
  );
}
