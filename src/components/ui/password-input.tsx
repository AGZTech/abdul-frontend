'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

export interface PasswordInputProps
  extends Omit<React.ComponentProps<'input'>, 'type'> {
  revealOnPointerHold?: boolean;
  className?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(function PasswordInput(
  { revealOnPointerHold = true, className, disabled, ...inputProps },
  ref
) {
  const [show, setShow] = React.useState(false);

  const showOn = () => revealOnPointerHold && setShow(true);
  const showOff = () => revealOnPointerHold && setShow(false);
  const toggle = () => !revealOnPointerHold && setShow((s) => !s);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!revealOnPointerHold) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setShow(true);
    }
  };
  const onKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!revealOnPointerHold) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setShow(false);
    }
  };

  const ariaLabel = show ? 'Hide password' : 'Show password';

  return (
    <InputGroup
      className={cn(
        // Ensures consistent height and focus ring across group
        'h-9',
        className
      )}
    >
      <InputGroupInput
        ref={ref}
        type={show ? 'text' : 'password'}
        autoComplete='current-password'
        disabled={disabled}
        {...inputProps}
      />

      <InputGroupAddon align='inline-end'>
        <InputGroupButton
          type='button'
          variant='ghost'
          size='icon-sm'
          disabled={disabled}
          aria-label={ariaLabel}
          onPointerDown={showOn}
          onPointerUp={showOff}
          onPointerLeave={showOff}
          onPointerCancel={showOff}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onClick={toggle}
        >
          {show ? (
            <EyeOff className='size-4' aria-hidden='true' />
          ) : (
            <Eye className='size-4' aria-hidden='true' />
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
});
