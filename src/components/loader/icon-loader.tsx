'use client';
import React from 'react';

export default function IconLoader() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/100'>
      {/* use below instead above div to remove full page background */}
      {/* <div className="flex flex-col items-center justify-center gap-4"> */}
      <p className='animate-pulse text-sm font-medium text-slate-50'>
        Loading Garage 100% ...
      </p>
    </div>
  );
}
