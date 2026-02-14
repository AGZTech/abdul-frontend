import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useMemo
} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Pencil,
  Trash2,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import _ from 'lodash';
import IconLoader from '../loader/icon-loader';
import IconLoaderSmall from '../loader/icon-loader-small';
import { Combobox } from '../ui/custom/combobox-filter-datatable';

interface ColumnItem {
  key: string;
  header: string;
  field?: string;
  sortField?: string;
  dbField?: string;
  filter?: boolean;
  sortable?: boolean;
  filterType?: 'text' | 'dropdown';
  filterOptions?: any[];
  filterOptionLabel?: string;
  filterOptionValue?: string;
  filterPlaceholder?: string;
  body?: (data: any, options?: any) => React.ReactNode;
  bodyStyle?: React.CSSProperties;
}

interface ExtraButton {
  icon: React.ReactNode;
  tooltip?: string;
  onClick?: (item: any) => void;
  className?: string;
}

interface ImprovedDataTableProps {
  tableId?: string;
  data: any[];
  columns: ColumnItem[];
  totalRecords: number;
  page: number;
  limit: number;
  loading?: boolean;
  filter?: boolean;
  isView?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
  extraButtons?: (item: any) => ExtraButton[];
  onLoad?: (params: any) => void;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  showGridlines?: boolean;
  stripedRows?: boolean;
}

export interface ImprovedDataTableRef {
  refreshData: (options?: { page?: number }) => void;
  resetFilters: () => void;
}

const ImprovedDataTable = forwardRef<
  ImprovedDataTableRef,
  ImprovedDataTableProps
>(
  (
    {
      tableId,
      data,
      columns,
      totalRecords,
      page: initialPage,
      limit: initialLimit,
      loading = false,
      filter = false,
      isView = false,
      isEdit = false,
      isDelete = false,
      extraButtons,
      onLoad,
      onView,
      onEdit,
      onDelete,
      showGridlines = false,
      stripedRows = false
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialLimit);
    const [sortField, setSortField] = useState<string | undefined>();
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>();
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Initialize filters - use useMemo to prevent re-initialization
    const initialFilters = useMemo(() => {
      const filters: Record<string, any> = {};
      columns.forEach((col) => {
        if (col.filter && col.field) {
          filters[col.field] = '';
        }
      });
      return filters;
    }, [columns]);

    useEffect(() => {
      setFilters(initialFilters);
    }, [initialFilters]);

    // Debounced onLoad for text filters
    const debouncedOnLoad = useMemo(
      () =>
        _.debounce((params: any) => {
          if (onLoad) onLoad(params);
        }, 500),
      [onLoad]
    );

    // Segregate filters into dropdown filters and text search
    const segregateFilterValues = (filterObj: Record<string, any>) => {
      const apiFilters: Record<string, any> = {};
      const apiSearch: Record<string, any> = {};

      for (const key in filterObj) {
        const value = filterObj[key];

        if (
          value !== null &&
          value !== undefined &&
          value !== '' &&
          value !== '__all__'
        ) {
          const columnDef = columns.find((c) => c.field === key);
          if (!columnDef) continue;

          // Use dbField if available, otherwise use field
          const fieldName = columnDef.dbField || key;

          if (columnDef.filterType === 'text') {
            apiSearch[fieldName] = value;
          } else if (columnDef.filterType === 'dropdown') {
            apiFilters[fieldName] = value;
          }
        }
      }
      return { filters: apiFilters, search: apiSearch };
    };

    // Build API params
    const buildApiParams = () => {
      const { filters: apiFilters, search: apiSearch } =
        segregateFilterValues(filters);
      return {
        page: currentPage,
        limit: pageSize,
        sortBy: sortField,
        sortOrder: sortOrder,
        filters: apiFilters,
        search: apiSearch
      };
    };

    // Handle sort
    const handleSort = (field: string) => {
      let newSortOrder: 'asc' | 'desc' | undefined;

      if (sortField === field) {
        if (sortOrder === 'asc') newSortOrder = 'desc';
        else if (sortOrder === 'desc') newSortOrder = undefined;
        else newSortOrder = 'asc';
      } else {
        newSortOrder = 'asc';
      }

      setSortField(newSortOrder ? field : undefined);
      setSortOrder(newSortOrder);

      if (onLoad) {
        const { filters: apiFilters, search: apiSearch } =
          segregateFilterValues(filters);
        onLoad({
          page: currentPage,
          limit: pageSize,
          sortBy: newSortOrder ? field : undefined,
          sortOrder: newSortOrder,
          filters: apiFilters,
          search: apiSearch
        });
      }
    };

    // Handle filter change
    const handleFilterChange = (
      field: string,
      value: any,
      filterType?: string
    ) => {
      const newFilters = { ...filters, [field]: value };
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page on filter

      const params = {
        page: 1,
        limit: pageSize,
        sortBy: sortField,
        sortOrder: sortOrder,
        ...segregateFilterValues(newFilters)
      };

      if (filterType === 'text') {
        debouncedOnLoad(params);
      } else {
        if (onLoad) onLoad(params);
      }
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      if (onLoad) {
        onLoad({
          ...buildApiParams(),
          page: newPage
        });
      }
    };

    // Handle page size change
    const handlePageSizeChange = (newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(1);
      if (onLoad) {
        onLoad({
          ...buildApiParams(),
          page: 1,
          limit: newSize
        });
      }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      refreshData: (options?: { page?: number }) => {
        const pageToLoad = options?.page || currentPage;
        setCurrentPage(pageToLoad);
        if (onLoad) {
          onLoad({
            ...buildApiParams(),
            page: pageToLoad
          });
        }
      },
      resetFilters: () => {
        const resetFilters: Record<string, any> = {};
        columns.forEach((col) => {
          if (col.filter && col.field) {
            resetFilters[col.field] = '';
          }
        });
        setFilters(resetFilters);
        setCurrentPage(1);
        setSortField(undefined);
        setSortOrder(undefined);

        if (onLoad) {
          onLoad({
            page: 1,
            limit: pageSize,
            filters: {},
            search: {}
          });
        }
      }
    }));

    // Pagination calculations
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    // loading skeleton
    if (loading && data?.length === 0) {
      return (
        <div className='w-full space-y-4'>
          <div className='rounded-md border bg-white'>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns?.map((col) => (
                    <TableHead
                      key={col.key}
                      style={{ minWidth: 150, maxWidth: 150 }}
                    >
                      <Skeleton className='h-4 w-full bg-gray-200' />
                    </TableHead>
                  ))}
                  {(isView || isEdit || isDelete || extraButtons) && (
                    <TableHead>
                      <Skeleton className='h-4 w-20 bg-gray-200' />
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        style={{ minWidth: 150, maxWidth: 150 }}
                      >
                        <Skeleton className='h-4 w-full bg-gray-200' />
                      </TableCell>
                    ))}
                    {(isView || isEdit || isDelete || extraButtons) && (
                      <TableCell>
                        <Skeleton className='h-4 w-20 bg-gray-200' />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }

    return (
      <div className='w-full'>
        <div className='rounded-md border'>
          <div className='overflow-x-auto'>
            <Table
              className={`bg-background rounded-md border ${showGridlines ? 'border-collapse' : ''}`}
              style={{
                tableLayout: 'auto',
                minWidth: '100%',
                borderCollapse: showGridlines ? 'collapse' : 'separate'
              }}
            >
              <TableHeader className='rounded-md border'>
                {/* Header Row */}
                <TableRow>
                  {columns?.map((col) => (
                    <TableHead
                      key={col.key}
                      style={col.bodyStyle}
                      className={`text-sm font-normal whitespace-nowrap ${showGridlines ? 'border border-gray-200' : ''}`}
                    >
                      <div className='flex items-center gap-2'>
                        <span>{col.header}</span>
                        {col.sortable && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-6 w-6 p-0'
                            onClick={() =>
                              handleSort(col.sortField || col.field || '')
                            }
                          >
                            {sortField === (col.sortField || col.field) ? (
                              sortOrder === 'asc' ? (
                                <ArrowUp className='h-4 w-4' />
                              ) : (
                                <ArrowDown className='h-4 w-4' />
                              )
                            ) : (
                              <ArrowUpDown className='h-4 w-4' />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {(isView || isEdit || isDelete || extraButtons) && (
                    <TableHead
                      className={`text-xs font-semibold whitespace-nowrap ${showGridlines ? 'border border-gray-200' : ''}`}
                      style={{ minWidth: '120px' }}
                    >
                      ACTIONS
                    </TableHead>
                  )}
                </TableRow>

                {/* Filter Row */}
                {filter && (
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead
                        key={`filter-${col.key}`}
                        className={`${showGridlines ? 'border border-gray-200' : ''}`}
                      >
                        {col.filter && col.field && (
                          <>
                            {col.filterType === 'text' ? (
                              <Input
                                placeholder={
                                  col.filterPlaceholder || 'Search...'
                                }
                                value={filters[col.field] || ''}
                                onChange={(e) =>
                                  handleFilterChange(
                                    col.field!,
                                    e.target.value,
                                    'text'
                                  )
                                }
                                className='h-8 py-4 placeholder:text-xs placeholder:text-gray-400'
                              />
                            ) : col.filterType === 'dropdown' ? (
                              <Combobox
                                value={filters[col.field] || null}
                                onChange={(val) =>
                                  handleFilterChange(
                                    col.field!,
                                    val ?? '',
                                    'dropdown'
                                  )
                                }
                                options={
                                  col.filterOptions?.map((option: any) => ({
                                    label: col.filterOptionLabel
                                      ? option[col.filterOptionLabel]
                                      : option,
                                    value: col.filterOptionValue
                                      ? String(option[col.filterOptionValue])
                                      : String(option)
                                  })) || []
                                }
                                placeholder={
                                  col.filterPlaceholder || 'Select...'
                                }
                              />
                            ) : null}
                          </>
                        )}
                      </TableHead>
                    ))}
                    {(isView || isEdit || isDelete || extraButtons) && (
                      <TableHead></TableHead>
                    )}
                  </TableRow>
                )}
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length +
                        (isView || isEdit || isDelete || extraButtons ? 1 : 0)
                      }
                      className='py-8 text-center'
                    >
                      {/* <Loader2 className='mx-auto h-6 w-6 animate-spin' /> */}
                      <IconLoaderSmall />
                    </TableCell>
                  </TableRow>
                ) : data && data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className={
                        stripedRows && rowIndex % 2 === 1 ? 'bg-muted/50' : ''
                      }
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          style={col.bodyStyle}
                          className={`text-xs break-words whitespace-normal ${showGridlines ? 'border border-gray-200' : ''}`}
                        >
                          {col.body
                            ? col.body(row, {
                              rowIndex: startRecord + rowIndex - 1
                            })
                            : col.field
                              ? row[col.field]
                              : '-'}
                        </TableCell>
                      ))}
                      {(isView || isEdit || isDelete || extraButtons) && (
                        <TableCell
                          className={
                            showGridlines ? 'border border-gray-200' : ''
                          }
                        >
                          <div className='flex items-center gap-1'>
                            {extraButtons &&
                              extraButtons(row).map((btn, btnIdx) => (
                                <Button
                                  key={btnIdx}
                                  variant='ghost'
                                  size='sm'
                                  className={btn.className}
                                  onClick={() => btn.onClick?.(row)}
                                  title={btn.tooltip}
                                >
                                  {btn.icon}
                                </Button>
                              ))}
                            {isView && (
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onView?.(row)}
                                title='View'
                                className='cursor-pointer'
                              >
                                <Eye className='h-4 w-4' />
                              </Button>
                            )}
                            {isEdit && (
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => onEdit?.(row)}
                                title='Edit'
                                className='cursor-pointer'
                              >
                                <Pencil className='h-4 w-4' />
                              </Button>
                            )}
                            {isDelete && (
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-destructive hover:text-destructive cursor-pointer'
                                onClick={() => onDelete?.(row)}
                                title='Delete'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        columns.length +
                        (isView || isEdit || isDelete || extraButtons ? 1 : 0)
                      }
                      className='text-muted-foreground py-8 text-center'
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Starts Here*/}
        <div className='mt-1 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className='h-8 w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <span className='px-2 text-sm'>
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ImprovedDataTable.displayName = 'ImprovedDataTable';

export default ImprovedDataTable;
