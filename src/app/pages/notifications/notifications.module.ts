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
  NbInputModule,
  NbDialogModule,
  NbCheckboxModule,
  NbSelectModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ThemeModule } from '../../@theme/theme.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbIconModule,
    NbActionsModule,
    NgSelectModule,
    NbSpinnerModule,
    NbAccordionModule,
    NbBadgeModule,
    NbInputModule,
    NbDialogModule,
    NgxDatatableModule,
    NbSelectModule,
    NbCheckboxModule,
    NbUserModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbButtonModule,
    NotificationsRoutingModule,
    SharedModule,
  ],
  declarations: [
    NotificationsComponent,
    IndexComponent,
  ],
})
export class NotificationsModule { }
