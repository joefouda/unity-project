import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS_FOR_ADMIN: NbMenuItem[] = [
  {
    title: 'DASHBOARD',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'COMPANIES',
    icon: 'briefcase-outline',
    link: '/pages/companies',
  },
  {
    title: 'USERS',
    icon: 'people-outline',
    link: '/pages/users',
  },
  {
    title: 'PACKAGES',
    icon: 'options-2-outline',
    link: '/pages/packages',
  },
  {
    title: 'PENDING_REGISTRATION',
    icon: 'email-outline',
    link: '/pages/pending-registration',
  },
  {
    title: 'SUBSCRIPTION_HISTORY',
    icon: 'calendar-outline',
    link: '/pages/g/subsciption-history',
  },
  {
    title: 'SUPPORT',
    icon: 'edit-outline',
    link: '/pages/g/support',
  },
  {
    title: 'billing',
    icon: 'credit-card-outline',
    link: '/pages/g/billing',
  },
];

export const MENU_ITEMS_FOR_MANAGER: NbMenuItem[] = [
  {
    title: 'DASHBOARD',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'DEPARTMENT',
    icon: 'briefcase-outline',
    link: '/pages/departments',
  },
  {
    title: 'EMPLOYEES',
    icon: 'people-outline',
    link: '/pages/employees',
  },
  {
    title: 'LEAVES',
    icon: 'log-out-outline',
    link: '/pages/leaves',
  },
  {
    title: 'ATTENDANCE',
    icon: 'checkmark-square-outline',
    link: '/pages/attendance-sheet',
  },
  {
    title: 'SHIFTS',
    icon: 'clock-outline',
    link: '/pages/shifts',
  },
  {
    title: 'PAYROLL',
    icon: 'shopping-bag-outline',
    link: '/pages/payroll',
  },
  {
    title: 'allowances',
    icon: 'people-outline',
    link: '/pages/allowances',
  },
  {
    title: 'POSITION',
    icon: 'trending-up-outline',
    link: '/pages/positions',
  },
  {
    title: 'HOLIDAYS',
    icon: 'heart-outline',
    link: '/pages/holidays',
  },
  {
    title: 'NOTIFICATIONS',
    icon: 'log-out-outline',
    link: '/pages/notifications',
  },
  {
    title: 'Chat',
    icon: 'message-circle-outline',
    link: '/pages/extra/chat',
  },
  {
    title: 'Calendar',
    icon: 'calendar-outline',
    link: '/pages/extra/calendar',
  },
  {
    title: 'Company',
    expanded:true,
    children:[
      {
        title:'Main Settings',
        icon: 'settings-2-outline',
        link: '/pages/g/company-profile',
      },
      {
        title: 'VACATIONS',
        icon: 'sun',
        link: '/pages/vacations',
      }
    ],
    icon: 'settings-2-outline',
  },
  {
    title: 'hierarchy',
    icon: 'list-outline',
    link: '/pages/extra/hierarchy',
  },
  {
    title: 'branches',
    icon: 'map-outline',
    link: '/pages/branches',
  },
  {
    title: 'billing',
    icon: 'credit-card-outline',
    link: '/pages/g/billing',
  },
];

export const MENU_ITEMS_FOR_EMPLOYEE: NbMenuItem[] = [
  {
    title: 'STATS',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'ATTENDANCE_HISTORY',
    icon: 'checkmark-square-outline',
    link: '/pages/attendance-sheet',
  },
  {
    title: 'LEAVES',
    icon: 'log-out-outline',
    link: '/pages/leaves',
  },
  {
    title: 'NOTIFICATIONS',
    icon: 'log-out-outline',
    link: '/pages/notifications',
  },
  {
    title: 'Chat',
    icon: 'message-circle-outline',
    link: '/pages/extra/chat',
  },
  {
    title: 'Calendar',
    icon: 'calendar-outline',
    link: '/pages/extra/calendar',
  },
  {
    title: 'hierarchy',
    icon: 'list-outline',
    link: '/pages/extra/hierarchy',
  },
  {
    title: 'PAYROLL',
    icon: 'shopping-bag-outline',
    link: '/pages/payroll',
  },
];
