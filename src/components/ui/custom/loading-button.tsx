import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

export function LoadingButton({
  isLoading,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={isLoading || props.disabled}
      {...props}
      className='cursor-pointer'
    >
      {isLoading && <Spinner className='mr-2 h-4 w-4' />}
      {children}
    </Button>
  );
}
