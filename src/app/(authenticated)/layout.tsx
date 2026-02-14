'use client';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import IconLoader from '@/components/loader/icon-loader';

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, status } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    //loading finished but user is not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/sign-in');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className='flex h-screen items-center justify-center'>
        {/* <Spinner /> */}
        <IconLoader />
      </div>
    );
  }

  if (status === 'authenticated' && user) {
    return <>{children}</>;
  }
  return null;
}
