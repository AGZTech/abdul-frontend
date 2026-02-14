import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  // {
  //   title: 'Account',
  //   url: '#',
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Company',
  //       url: '/dashboard/masters/company',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Campaign',
  //       url: '/dashboard/masters/campaign',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Job Function',
  //       url: '/dashboard/masters/job-function',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Job Level',
  //       url: '/dashboard/masters/job-level',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Industry',
  //       url: '/dashboard/masters/industry',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Region',
  //       url: '/dashboard/masters/region',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Lead Type',
  //       url: '/dashboard/masters/lead-type',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Subject',
  //       url: '/dashboard/masters/subject',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     }
  //     // {
  //     //   title: 'Email Subject',
  //     //   url: '/dashboard/masters/email-subject',
  //     //   icon: 'userPen',
  //     //   shortcut: ['m', 'm']
  //     // }
  //     // {
  //     //   title: 'Profile',
  //     //   url: '/dashboard/profile',
  //     //   icon: 'userPen',
  //     //   shortcut: ['m', 'm']
  //     // },
  //     // {
  //     //   title: 'Login',
  //     //   shortcut: ['l', 'l'],
  //     //   url: '/',
  //     //   icon: 'login'
  //     // }
  //   ]
  // },
  {
    title: 'About Us',
    url: '/dashboard/about-us',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'History',
    url: '/dashboard/history',
    icon: 'kanban', // Using kanban icon as placeholder/consistent style
    shortcut: ['h', 'h'],
    isActive: false,
    items: []
  },
  // {
  //   title: 'Reports',
  //   url: '/dashboard/report-list',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // },
  // {
  //   title: 'Export Analytics',
  //   url: '/dashboard/export-analytics',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];
