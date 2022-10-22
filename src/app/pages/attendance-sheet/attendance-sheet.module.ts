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
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { AttendanceSheetRoutingModule } from './attendance-sheet-routing.module';
import { AttendanceSheetComponent } from './attendance-sheet.component';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

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
    AttendanceSheetRoutingModule,
    SharedModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    ExportAsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBiHjMoVeGMKW1RgpWeCBtGfTvvNXil_vI'
    })
  ],
  declarations: [
    AttendanceSheetComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class AttendanceSheetModule { }

