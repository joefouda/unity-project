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
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
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
    EmployeesRoutingModule,
    SharedModule,
    ExportAsModule,
  ],
  declarations: [
    EmployeesComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class EmployeesModule { }
