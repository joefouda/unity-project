import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtraComponentsComponent } from './extra-components.component';
import { CalendarNewComponent } from './calendar-new/calendar-new.component';
import { ChatComponent } from './chat/chat.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';

const routes: Routes = [{
  path: '',
  component: ExtraComponentsComponent,
  children: [
    {
      path: 'calendar',
      component: CalendarNewComponent,
    },
    {
      path: 'chat',
      component: ChatComponent,
    },
    {
      path: 'hierarchy',
      component: HierarchyComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtraComponentsRoutingModule {
}
