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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { DemoLeavesRoutingModule } from './demo.leaves-routing.module';
import { IndexComponent } from './index/index.component';
import { DemoLeavesComponent } from './demo.leaves.component';
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
    DemoLeavesRoutingModule,
    SharedModule,
    ExportAsModule,
  ],
  declarations: [
    IndexComponent,
    AddComponent,
    DemoLeavesComponent
  ],
})
export class DemoLeavesModule { }

