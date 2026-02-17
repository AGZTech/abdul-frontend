'use client';
import React from 'react';

import Image from 'next/image';

export default function IconLoaderSmall() {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='relative h-13 w-13'>
        <Image
          src='/assets/icon.svg'
          alt='Icon outline'
          fill
          className='object-contain opacity-20'
        />
        <div
          className='absolute inset-0 h-full w-full'
          style={{
            maskImage: 'url(/assets/icon.svg)',
            WebkitMaskImage: 'url(/assets/icon.svg)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        >
          <div
            className='absolute bottom-0 left-0 w-full animate-[fill-up_0.9s_ease-out_forwards]'
            style={{
              background: 'linear-gradient(to top, #d81233, #8b0b20)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
