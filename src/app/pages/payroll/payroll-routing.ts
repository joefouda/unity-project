import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { PayrollComponent } from './payroll.component';

const routes: Routes = [{
  path: '',
  component: PayrollComponent,
  children: [
    {
      path: '',
      component: IndexComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {
}
