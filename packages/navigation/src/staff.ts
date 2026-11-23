export const staffScreens = [
  {
    id: 'STF-AUTH-01',
    title: 'Sign In',
    path: '/auth/sign-in',
  },
  {
    id: 'STF-ASG-01',
    title: 'Assignment Home',
    path: '/assignments',
  },
  {
    id: 'STF-ASG-02',
    title: 'Assignment Detail',
    path: '/assignments/detail',
  },
  {
    id: 'STF-ASG-03',
    title: 'Update Assignment Status',
    path: '/assignments/update-status',
  },
  {
    id: 'STF-ASG-04',
    title: 'Operational Note / Report Issue',
    path: '/assignments/report-issue',
  },
  {
    id: 'STF-ASG-05',
    title: 'Assignment History',
    path: '/assignments/history',
  },
] as const;
