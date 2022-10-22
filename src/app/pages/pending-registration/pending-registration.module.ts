import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbRouteTabsetModule,
  NbIconModule,
  NbActionsModule,
  NbSpinnerModule,
  NbBadgeModule,
  NbListModule,
  NbInputModule,
  NbSelectModule,
  NbToggleModule,
  NbDatepickerModule,
  NbDialogModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ThemeModule } from '../../@theme/theme.module';
import { PendingRegistrationRoutingModule } from './pending-registration-routing.module';
import { PendingRegistrationComponent } from './pending-registration.component';
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
    NbActionsModule,
    NgxMaterialTimepickerModule,
    NgbModule,
    NbDatepickerModule,
    NbSpinnerModule,
    NgxDatatableModule,
    NbAccordionModule,
    NbSelectModule,
    NbToggleModule,
    NbDialogModule,
    NbUserModule,
    NgSelectModule,
    PendingRegistrationRoutingModule,
    SharedModule,
  ],
  declarations: [
    PendingRegistrationComponent,
    IndexComponent,
  ],
})
export class PendingRegistrationModule { }

