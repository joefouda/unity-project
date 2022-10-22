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
  NbDialogModule,
  NbAccordionModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ThemeModule } from '../../@theme/theme.module';
import { ShiftsRoutingModule } from './shifts-routing.module';
import { ShiftsComponent } from './shifts.component';
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
    NbSelectModule,
    NbAccordionModule,
    NbListModule,
    NbActionsModule,
    NbSpinnerModule,
    NgxMaterialTimepickerModule,
    NbDialogModule,
    NbUserModule,
    ShiftsRoutingModule,
    SharedModule,
  ],
  declarations: [
    ShiftsComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class ShiftsModule { }
