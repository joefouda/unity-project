import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbRouteTabsetModule,
  NbIconModule,
  NbActionsModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbBadgeModule,
  NbListModule,
  NbInputModule,
  NbSelectModule,
  NbStepperModule,
  NbDialogModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { PayrollRoutingModule } from './payroll-routing';
import { PayrollComponent } from './payroll.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    NbInputModule,
    ReactiveFormsModule,
    ThemeModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbBadgeModule,
    NbListModule,
    NbDatepickerModule,
    NbStepperModule,
    NbActionsModule,
    NbSpinnerModule,
    NbSelectModule,
    NbDialogModule,
    NbAccordionModule,
    NbUserModule,
    PayrollRoutingModule,
    SharedModule,
    ExportAsModule,
  ],
  declarations: [
    PayrollComponent,
    IndexComponent,
  ],
})
export class PayrollModule { }
