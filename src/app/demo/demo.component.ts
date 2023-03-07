import { Component, OnInit } from '@angular/core';
import { NbSpinnerService } from '@nebular/theme';
@Component({
  selector: 'ngx-demo',
  styleUrls: ['demo.component.scss'],
  template: `
      <router-outlet></router-outlet>
  `,
})
export class DemoComponent implements OnInit {

  constructor(private spinner$: NbSpinnerService) {
  }
  ngOnInit() {
    this.spinner$.load();
  }
}
