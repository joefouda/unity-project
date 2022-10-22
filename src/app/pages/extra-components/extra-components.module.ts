import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbChatModule,
  NbListModule,
  NbIconModule,
  NbProgressBarModule,
  NbUserModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbInputModule,
  NbDatepickerModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { ThemeModule } from '../../@theme/theme.module';
import { ExtraComponentsRoutingModule } from './extra-components-routing.module';

// components
import { ExtraComponentsComponent } from './extra-components.component';
import { ChatComponent } from './chat/chat.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';


import { CalendarNewComponent } from './calendar-new/calendar-new.component';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxOrgChartModule } from 'ngx-org-chart';

const COMPONENTS = [
  ExtraComponentsComponent,
  CalendarNewComponent,
  ChatComponent,
  HierarchyComponent,
];

const MODULES = [
  NbAlertModule,
  NbActionsModule,
  NgSelectModule,
  FormsModule,
  ReactiveFormsModule,
  NbButtonModule,
  NbUserModule,
  NbInputModule,
  NbDatepickerModule,
  NbCardModule,
  NbListModule,
  NbChatModule,
  NbIconModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTabsetModule,
  ThemeModule,
  ExtraComponentsRoutingModule,
  CalendarModule,
  TranslateModule,
  NgxOrgChartModule
];

@NgModule({
  imports: [
    ...MODULES,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    FlatpickrModule.forRoot(),
  ],
  declarations: [
    ...COMPONENTS,
  ]
})
export class ExtraComponentsModule { }
