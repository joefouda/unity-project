import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbButtonModule,
  NbCardModule,
  NbRouteTabsetModule,
  NbSpinnerModule,
  NbListModule,
  NbInputModule,
  NbDialogModule,
  NbSelectModule,
  NbIconModule,
  NbDatepickerModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { IndexComponent } from './index/index.component';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { AddComponent } from './add/add.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbAccordionModule,
    NbDialogModule,
    NbRouteTabsetModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbSpinnerModule,
    NbInputModule,
    NbSelectModule,
    NgxDatatableModule,
    NbListModule,
    NbUserModule,
    UsersRoutingModule,
    SharedModule,
    ExportAsModule,
    NbDatepickerModule,
    NgSelectModule,
  ],
  declarations: [
    UsersComponent,
    IndexComponent,
    ProfileComponent,
    AddComponent,
  ],
})
export class UsersModule { }
