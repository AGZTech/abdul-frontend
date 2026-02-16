'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ComboboxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  emptyText = 'No results found.',
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'h-8 w-full justify-between text-xs',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {selectedLabel || placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandEmpty>{emptyText}</CommandEmpty>
          {/* Wrap CommandGroup with scrollable div */}
          <div className='max-h-60 overflow-y-auto'>
            <CommandGroup>
              <CommandItem
                key='__all__'
                onSelect={() => {
                  onChange('__all__');
                  setOpen(false);
                }}
              >
                All
                {value === '__all__' && <Check className='ml-auto h-4 w-4' />}
              </CommandItem>

              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  {value === option.value && (
                    <Check className='ml-auto h-4 w-4' />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
