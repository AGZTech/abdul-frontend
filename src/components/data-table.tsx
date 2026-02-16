// components/data-table/DataTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
}

export interface ActionConfig<T> {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: ActionConfig<T>;
  showActions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
  showSerialNo?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  serialNoHeader?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  showActions = { view: false, edit: false, delete: false },
  showSerialNo = true,
  loading = false,
  emptyMessage = 'No data available',
  serialNoHeader = 'S.No'
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilter = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters and sorting
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, filters, sortConfig]);

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className='h-4 w-4 text-gray-400' />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className='h-4 w-4 text-gray-600' />
    ) : (
      <ArrowDown className='h-4 w-4 text-gray-600' />
    );
  };

  const hasAnyAction =
    showActions.view || showActions.edit || showActions.delete;

  if (loading) {
    return (
      <div className='rounded-lg bg-white p-8 text-center shadow'>
        <div className='animate-pulse'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='overflow-hidden rounded-lg bg-white shadow'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='border-b bg-gray-50'>
            <tr>
              {showSerialNo && (
                <th className='w-20 px-6 py-3 text-left text-[14px] leading-5 font-normal text-gray-600'>
                  {serialNoHeader}
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className='px-6 py-3 text-left text-[14px] leading-5 font-normal text-gray-600'
                  style={{ width: column.width }}
                >
                  <div className='flex items-center gap-2'>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className='rounded p-1 hover:bg-gray-200'
                      >
                        {getSortIcon(column.key)}
                      </button>
                    )}
                  </div>
                  {column.filterable && (
                    <Input
                      placeholder={`Filter ${column.header}`}
                      value={filters[column.key] || ''}
                      onChange={(e) => handleFilter(column.key, e.target.value)}
                      className='mt-2 h-8 text-xs'
                    />
                  )}
                </th>
              ))}
              {hasAnyAction && (
                <th className='w-32 px-6 py-3 text-left text-[14px] leading-5 font-normal text-gray-600'>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {processedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (showSerialNo ? 1 : 0) +
                    (hasAnyAction ? 1 : 0)
                  }
                  className='px-6 py-8 text-center text-gray-500'
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              processedData.map((row, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  {showSerialNo && (
                    <td className='px-6 py-4 text-[13px] leading-5 font-normal text-gray-700'>
                      {index + 1}
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className='px-6 py-4 text-[13px] leading-5 font-normal text-gray-700'
                    >
                      {column.render
                        ? column.render(row, index)
                        : row[column.key]}
                    </td>
                  ))}
                  {hasAnyAction && (
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2'>
                        {showActions.view && actions?.onView && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-900'
                            onClick={() => actions.onView!(row)}
                            title='View'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                        )}
                        {showActions.edit && actions?.onEdit && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-900'
                            onClick={() => actions.onEdit!(row)}
                            title='Edit'
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                        )}
                        {showActions.delete && actions?.onDelete && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-900'
                            onClick={() => actions.onDelete!(row)}
                            title='Delete'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
