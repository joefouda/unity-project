import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DemoComponent } from './demo.component';
import { HomeComponent } from './home/home.component';
import { PayrollComponent } from './demoPayroll/payroll.component'

export const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'leaves',
        loadChildren: () => import('./demo.leaves/demo.leaves.module')
          .then(m => m.DemoLeavesModule),
      },
      {
        path: 'payroll',
        component: PayrollComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {
}
