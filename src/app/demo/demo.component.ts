import { Component, OnInit } from '@angular/core';
import { NbSpinnerService } from '@nebular/theme';
@Component({
  selector: 'ngx-demo',
  styleUrls: ['demo.component.scss'],
  template: `
    <div class="demo-container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class DemoComponent implements OnInit {

  constructor(private spinner$: NbSpinnerService) {
  }
  ngOnInit() {
    this.spinner$.load();
  }
}
