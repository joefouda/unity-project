import { Component, OnInit } from '@angular/core';
import { NbSpinnerService } from '@nebular/theme';
@Component({
  selector: 'ngx-policy',
  styleUrls: ['policy.component.scss'],
  template: `
      <router-outlet></router-outlet>
  `,
})
export class PolicyComponent implements OnInit {

  constructor(private spinner$: NbSpinnerService) {
  }
  ngOnInit() {
    this.spinner$.load();
  }
}
