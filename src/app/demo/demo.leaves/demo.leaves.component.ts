import { Component } from '@angular/core';

@Component({
  selector: 'ngx-demo-leaves',
  styleUrls: ['demo.leaves.component.scss'],
  template: `
    <nb-layout>
      <nb-layout-column class="demo-main">
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class DemoLeavesComponent {
}