import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';
import { IMAGE_URL } from '../../../providers/providers';

@Component({
  selector: 'ngx-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {

  active;
  inactive;
  shifts = [];
  allshifts = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  isDone = false;
  token;
  messages;
  imageUrl = IMAGE_URL;

    query = {
    name: '',
    mobile: '',
    is_active: '',
  }
  q = "";
  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    ) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();

  }

  load() {
    this.api.protectedGet("shifts?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      console.log(data)
      this.shifts = data.data;
      this.loaded = true;
    });
  }

  setPage(pageNumber){
    this.page = pageNumber;
    this.shifts = [];
    this.loaded = false;
    this.scrollService.scrollTo(0,0);
    this.load();
  }


  delete(index, shift) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + shift.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + shift.name,
          },
        }).onClose.subscribe((data) => {
          if(data){
            this.api.protectedDelete('shifts/' + shift.id, this.token).subscribe((data) => {
              this.shifts.splice(index, 1);
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            })
          }
          console.log(data);
        });
      });
  }

  toggle(index, shift) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        let title = "";
        let content = "";
        if(shift.is_active){
          title = this.messages.DEACTIVATE_ITEM;
          content = this.messages.ARE_YOU_SURE_DEACTIVATE;
        } else {
          title = this.messages.ACTIVEATE_ITEM;
          content = this.messages.ARE_YOU_SURE_ACTIVEATE;
        }
        this.dialogService.open(DeleteComponent, {
          context: {
            title: title + " " + shift.name,
            content: content + " " + shift.name,
          },
        }).onClose.subscribe((data) => {
          if(data){
            this.api.protectedGet('shifts/' + shift.id + '/toggle', this.token).subscribe((data) => {
              console.log(data);
              shift.is_active = !shift.is_active;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            })
          }
          console.log(data);
        });
      });
  }

  search(){
    const entries = Object.entries(this.query);
    this.q = "";
    for (const [key, value] of entries) {
      this.q += "&" + key + "=" + value
    }
    this.page = 1;
    this.load();
  }
}
