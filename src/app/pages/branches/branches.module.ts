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
  NbDialogModule,
  NbCheckboxModule,
  NbAccordionModule,
  NbUserModule,
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { ExportAsModule } from 'ngx-export-as';

import { ThemeModule } from '../../@theme/theme.module';
import { BsranchesRoutingModule } from './branches-routing.module';
import { BsranchesComponent } from './branches.component';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from '../../shared/shared.module';
import { AgmCoreModule } from '@agm/core';

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
    NbSpinnerModule,
    NbSelectModule,
    NbCheckboxModule,
    NbDialogModule,
    NbUserModule,
    NgSelectModule,
    BsranchesRoutingModule,
    SharedModule,
    ExportAsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBiHjMoVeGMKW1RgpWeCBtGfTvvNXil_vI',
      libraries: ['places']
    })
  ],
  declarations: [
    BsranchesComponent,
    IndexComponent,
    AddComponent,
  ],
})
export class BranchesModule { }

