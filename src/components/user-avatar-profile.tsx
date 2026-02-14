import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatarProfile({ className, showInfo = false, user }: any) {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={user?.imageUrl || ''} alt={user?.fullName || ''} />
        <AvatarFallback className='rounded-lg'>
          {user?.fullName || 'N'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>
            {user?.fullName || 'N'}
          </span>
          <span className='truncate text-xs'>{user?.email}</span>
        </div>
      )}
    </div>
  );
}
