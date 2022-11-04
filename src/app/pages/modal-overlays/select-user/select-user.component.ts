import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-select-user',
  templateUrl: 'select-user.component.html',
  styleUrls: ['select-user.component.scss'],
})
export class SelectUserComponent {

  @Input() users: [];
  user;
  constructor(protected ref: NbDialogRef<SelectUserComponent>) {}

  cancel() {
    this.ref.close(null);
  }

  yes() {
    this.ref.close(this.user);
  }
}
