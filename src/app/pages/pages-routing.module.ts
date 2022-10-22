import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'companies',
      loadChildren: () => import('./companies/companies.module')
        .then(m => m.CompaniesModule),
    },
    {
      path: 'employees',
      loadChildren: () => import('./employees/employees.module')
        .then(m => m.EmployeesModule),
    },
    {
      path: 'departments',
      loadChildren: () => import('./departments/departments.module')
        .then(m => m.DepartmentsModule),
    },
    {
      path: 'branches',
      loadChildren: () => import('./branches/branches.module')
        .then(m => m.BranchesModule),
    },
    {
      path: 'shifts',
      loadChildren: () => import('./shifts/shifts.module')
        .then(m => m.ShiftsModule),
    },
    {
      path: 'packages',
      loadChildren: () => import('./packages/packages.module')
        .then(m => m.PackageesModule),
    },
    {
      path: 'allowances',
      loadChildren: () => import('./allowances/allowances.module')
        .then(m => m.AllowancesModule),
    },
    {
      path: 'notifications',
      loadChildren: () => import('./notifications/notifications.module')
        .then(m => m.NotificationsModule),
    },
    {
      path: 'positions',
      loadChildren: () => import('./positions/positions.module')
        .then(m => m.PositionsModule),
    },
    {
      path: 'users',
      loadChildren: () => import('./users/users.module')
        .then(m => m.UsersModule),
    },
    {
      path: 'holidays',
      loadChildren: () => import('./holiday/holiday.module')
        .then(m => m.HolidayModule),
    },
    {
      path: 'extra',
      loadChildren: () => import('./extra-components/extra-components.module')
        .then(m => m.ExtraComponentsModule),
    },
    {
      path: 'g',
      loadChildren: () => import('./generic/generic.module')
        .then(m => m.GenericModule),
    },
    {
      path: 'leaves',
      loadChildren: () => import('./leaves/leaves.module')
        .then(m => m.LeavesModule),
    },
    {
      path: 'pending-registration',
      loadChildren: () => import('./pending-registration/pending-registration.module')
        .then(m => m.PendingRegistrationModule),
    },
    {
      path: 'attendance-sheet',
      loadChildren: () => import('./attendance-sheet/attendance-sheet.module')
        .then(m => m.AttendanceSheetModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
