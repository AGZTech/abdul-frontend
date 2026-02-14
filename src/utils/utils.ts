import { isNumber } from 'lodash';

export const buildQueryParams = (params: any = {}) => {
  const query = new URLSearchParams();

  if (params.pagination !== false) {
    const limit = params.limit || params.rows || 10;
    const page = params.page || 1;

    query.append('limit', limit);
    query.append('page', page);
  }

  // Sorting parameters
  if (params.sortBy) {
    query.append('sortBy', params.sortBy);
    query.append('sortOrder', params.sortOrder);
  }

  // Filters - FIXED: Include false values explicitly
  for (const filterField in params.filters) {
    if (
      params.filters[filterField] !== null &&
      params.filters[filterField] !== undefined
    ) {
      const filterValue = params.filters[filterField];
      // Include the filter if it's not null/undefined, including false values
      if (filterValue !== '' || filterValue === false) {
        query.append(`filters.${filterField}`, filterValue.toString());
      }
    }
  }

  // Handle the new 'search' object
  if (params.search) {
    for (const searchField in params.search) {
      if (params.search[searchField]) {
        // Append with the 'search.' prefix as required
        query.append(`search.${searchField}`, params.search[searchField]);
      }
    }
  }

  // Include parameters
  if (typeof params.include == 'object') {
    query.append('include', params.include.join(','));
  } else if (typeof params.include == 'string') {
    query.append('include', params.include);
  } else if (Array.isArray(params.include)) {
    query.append('include', params.include.map((i: any) => i.trim()).join(','));
  }

  for (const key in params) {
    if (
      ![
        'limit',
        'page',
        'rows',
        'sortBy',
        'sortOrder',
        'filters',
        'include',
        'pagination',
        'search'
      ].includes(key)
    ) {
      query.append(key, params[key]);
    }
  }

  return query.toString();
};

export const getRowLimitWithScreenHeight = (
  { headerHeight = 250, footerHeight = 50 } = {
    headerHeight: 250,
    footerHeight: 50
  }
) => {
  return 20;
};

export const goBack = (router: any) => {
  if (router && router.back) {
    router.back();
  }
  return;
};

export const formatNumber = (number: any) => {
  if (isNumber(number)) {
    return new Intl.NumberFormat('en-US').format(number);
  }
  return number;
};

export const getYears = () => {
  return Array.from({ length: 21 }, (_, i) => 2025 + i);
};

export const formatScore = (number: any) => {
  return Number.isInteger(Number(number))
    ? Number(number)
    : Number(number).toFixed(1);
};

export const parseQueryStringToObject = (query: any) => {
  if (Object.keys(query).length === 0) {
    return {
      limit: 20,
      page: 1,
      search: null,
      filters: {},
      include: ''
    };
  }

  const params: any = new URLSearchParams(query);
  const result = {};

  // Helper to convert to number if applicable
  const convertValue = (val: any) => {
    return !isNaN(val) && val.trim() !== '' ? Number(val) : val;
  };

  for (const [fullKey, value] of params.entries()) {
    const keys = fullKey.split('.');
    let current: any = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        const finalValue = convertValue(value);

        if (key in current) {
          if (Array.isArray(current[key])) {
            current[key].push(finalValue);
          } else {
            current[key] = [current[key], finalValue];
          }
        } else {
          current[key] = finalValue;
        }
      } else {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
    }
  }

  return result;
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior
    });
  }
};

export const getScoreBackgroundColor = (score: number) => {
  switch (Math.round(score)) {
    case 5:
      return '#63be7b'; // Green
    case 4:
      return '#b2d681'; // Yellow
    case 3:
      return '#faee80'; // Orange
    case 2:
      return '#f4a779'; // Red-Orange
    case 1:
    default:
      return '#ef686a'; // Dark Red
  }
};

const generateRandomId = (length: number = 7): string => {
  const randomSource =
    Date.now().toString(36) + Math.random().toString(36).substring(2);
  return randomSource.slice(-length).toLowerCase();
};

export const formatVersionName = (
  reviewTypeName?: string,
  evaluationTypeName?: string
): string => {
  if (!reviewTypeName || !evaluationTypeName) {
    return '';
  }

  // const cleanReviewType = reviewTypeName.replace(/\s+/g, '');
  // const cleanEvalType = evaluationTypeName.replace(/\s+/g, '');

  const randomPart = generateRandomId(7);
  return `${reviewTypeName}-${evaluationTypeName}-V_${randomPart}`;
};
