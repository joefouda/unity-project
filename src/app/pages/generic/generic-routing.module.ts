import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SupportComponent } from './support/support.component';
import { GenericComponent } from './generic.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { SubsDetailsComponent } from './subs-details/subs-details.component';
import { BillingComponent } from './billing/billing.component';
import { PolicyComponent } from './policy/policy.component';

const routes: Routes = [{
  path: '',
  component: GenericComponent,
  children: [
    {
      path: 'support',
      component: SupportComponent,
    },
    {
      path: 'company-profile',
      component: CompanyProfileComponent,
    },
    {
      path: 'billing',
      component: BillingComponent,
    },
    {
      path: 'policy',
      component: PolicyComponent,
    },
    {
      path: 'subsciption-history',
      component: SubsDetailsComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {
}
