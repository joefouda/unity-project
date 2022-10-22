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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { HolidayRoutingModule } from './holiday-routing.module';
import { HolidayComponent } from './holiday.component';
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
    NbActionsModule,
    NbAccordionModule,
    NgbModule,
    NbDatepickerModule,
    NbSpinnerModule,
    NgxDatatableModule,
    NbSelectModule,
    NbToggleModule,
    NbDialogModule,
    NbUserModule,
    NgSelectModule,
    HolidayRoutingModule,
    SharedModule,
  ],
  declarations: [
    HolidayComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class HolidayModule { }

