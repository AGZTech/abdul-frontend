import { getRowLimitWithScreenHeight } from './utils';

export const limitOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '70', value: 70 },
  { label: '100', value: 100 }
];

export const ACTIONS = {
  ADD: 'add',
  EDIT: 'edit',
  VIEW: 'view',
  DELETE: 'delete'
};

export const COMMENT_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
];
export const INACTIVITY_TIMEOUT = 10 * 60 * 1000;
export const WARNING_TIME = 30 * 1000;

export const INITIAL_PAGE = 1;
export const INITIAL_LIMIT = getRowLimitWithScreenHeight();
