'use client';

import {
  IconBell,
  IconCreditCard,
  IconLogout,
  IconSparkles,
  IconUserCircle
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { PostCall } from '@/lib/apiClient';

export function UserNav({
  user
}: {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await PostCall('/logout');
    } catch (error) {
      console.error('Logout API call failed', error);
    } finally {
      document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
      dispatch(logout());
      router.push('/auth/sign-in');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
            <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name || 'User'}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconSparkles className='mr-2 h-4 w-4' />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
            <IconUserCircle className='mr-2 h-4 w-4' />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconCreditCard className='mr-2 h-4 w-4' />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconBell className='mr-2 h-4 w-4' />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout className='mr-2 h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
