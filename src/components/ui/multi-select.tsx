'use client';

import * as React from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MultiSelectProps {
  options: Array<{
    value: string | number;
    label: string;
  }>;
  selected: (string | number)[];
  onSelectedChange: (selected: (string | number)[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      selected,
      onSelectedChange,
      placeholder = 'Select items...',
      searchPlaceholder = 'Search...'
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Determine selection states
    const allSelected =
      selected.length === options.length && options.length > 0;
    const someSelected = selected.length > 0 && !allSelected;
    const selectAllState: boolean | 'indeterminate' = allSelected
      ? true
      : someSelected
        ? 'indeterminate'
        : false;

    const handleToggle = (value: string | number) => {
      const isSelected = selected.some(
        (item) => String(item) === String(value)
      );

      if (isSelected) {
        onSelectedChange(
          selected.filter((item) => String(item) !== String(value))
        );
      } else {
        onSelectedChange([...selected, value]);
      }
    };

    const handleSelectAll = () => {
      if (allSelected) {
        onSelectedChange([]);
      } else {
        const allValues = options.map((opt) => opt.value);
        onSelectedChange(allValues);
      }
    };

    const handleRemove = (value: string | number) => {
      onSelectedChange(
        selected.filter((item) => String(item) !== String(value))
      );
    };

    const handleClearAll = () => {
      onSelectedChange([]);
      setSearchValue('');
    };

    // Get display text for trigger
    const getDisplayText = () => {
      if (selected.length === 0) return placeholder;
      if (allSelected) return `All selected (${selected.length})`;
      return `${selected.length} selected`;
    };

    // Get selected items as badges
    const getSelectedBadges = () => {
      if (selected.length === 0) return null;

      return selected.slice(0, 2).map((value) => {
        const option = options.find(
          (opt) => String(opt.value) === String(value)
        );
        if (!option) return null;

        return (
          <Badge
            key={option.value}
            variant='secondary'
            className='flex max-w-[120px] items-center gap-1 truncate px-2 py-1'
          >
            <span className='truncate'>{option.label}</span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-4 w-4 min-w-4 p-0 hover:bg-transparent'
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(option.value);
              }}
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        );
      });
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'min-h-10 w-full justify-between bg-transparent',
              'hover:border-input hover:bg-transparent'
            )}
          >
            <div className='flex flex-1 items-center gap-1 overflow-hidden'>
              {selected.length === 0 ? (
                <span className='text-muted-foreground truncate text-left'>
                  {placeholder}
                </span>
              ) : (
                <div className='flex flex-1 items-center gap-1 overflow-hidden'>
                  {selected.length <= 2 ? (
                    <div className='flex flex-wrap items-center gap-1'>
                      {getSelectedBadges()}
                      {selected.length > 2 && (
                        <Badge variant='outline' className='px-2 py-1'>
                          +{selected.length - 2} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className='truncate text-left'>
                      {getDisplayText()}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className='ml-2 flex flex-shrink-0 items-center gap-1'>
              {selected.length > 0 && !allSelected && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='text-muted-foreground h-6 w-6 min-w-6 p-0 hover:bg-transparent'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearAll();
                  }}
                >
                  <X className='h-3 w-3' />
                </Button>
              )}
              <ChevronDown
                className={cn(
                  'size-4 shrink-0 opacity-50',
                  open && 'rotate-180 transition-transform'
                )}
              />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='w-full p-0'
          align='start'
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className='space-y-2 p-4'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='pl-8'
                autoFocus
              />
            </div>

            {/* Select All option */}
            <div
              className='hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-sm px-1 py-2'
              onClick={handleSelectAll}
            >
              <Checkbox
                id='select-all'
                checked={selectAllState}
                onCheckedChange={handleSelectAll}
                className={cn(
                  'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
                  someSelected &&
                    'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground'
                )}
              />
              <label
                htmlFor='select-all'
                className='flex flex-1 cursor-pointer items-center justify-between text-sm font-medium'
              >
                <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                {someSelected && (
                  <span className='text-muted-foreground text-xs'>
                    {selected.length} selected
                  </span>
                )}
              </label>
            </div>

            <div className='max-h-64 w-full space-y-1 overflow-y-auto'>
              {filteredOptions.length === 0 ? (
                <div className='text-muted-foreground py-6 text-center text-sm'>
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selected.some(
                    (item) => String(item) === String(option.value)
                  );

                  return (
                    <div
                      key={String(option.value)}
                      className='hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-sm px-1 py-2'
                      onClick={() => handleToggle(option.value)}
                    >
                      <Checkbox
                        id={String(option.value)}
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(option.value)}
                        className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                      />
                      <label
                        htmlFor={String(option.value)}
                        className='flex-1 cursor-pointer text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {option.label}
                      </label>
                    </div>
                  );
                })
              )}
            </div>

            <div className='flex gap-2 border-t pt-2'>
              <Button
                variant='outline'
                size='sm'
                className='flex-1'
                onClick={handleClearAll}
                disabled={selected.length === 0}
              >
                Clear All
              </Button>
              <Button
                size='sm'
                className='flex-1'
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
