import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-sdelete',
  templateUrl: 'delete.component.html',
  styleUrls: ['delete.component.scss'],
})
export class DeleteComponent {

  @Input() content: string;
  @Input() title: string;

  constructor(protected ref: NbDialogRef<DeleteComponent>) {}

  cancel() {
    this.ref.close(false);
  }

  yes() {
    this.ref.close(true);
  }
}
