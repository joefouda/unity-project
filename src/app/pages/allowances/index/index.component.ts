import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';

@Component({
  selector: 'ngx-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {

  active;
  inactive;
  allowances = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  isDone = false;
  token;
  messages;


  totalPages;
  totalItems;
  lastPage;

  query = {
    name: '',
    is_active: '',
  }
  q = "";

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private scrollService: NbLayoutScrollService,
    private toastrService: NbToastrService) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();
  }

  load() {
    this.api.protectedGet("allowances?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.allowances = data.data;
      this.loaded = true;
    });
  }

  setPage(pageNumber){
    this.page = pageNumber;
    this.allowances = [];
    this.loaded = false;
    this.scrollService.scrollTo(0,0);
    setTimeout(() => {
      this.load();
    }, 1000);
  }
 

  delete(index, subsPackage) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + subsPackage.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + subsPackage.name,
          },
        }).onClose.subscribe((data) => {
          if(data){
            console.log(index);
            this.api.protectedDelete('allowances/' + subsPackage.id, this.token).subscribe((data) => {
              this.allowances.splice(index, 1);
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            })
          }
          console.log(data);
        });
      });
  }

  toggle(index, subsPackage) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        let title = "";
        let content = "";
        if(subsPackage.is_active){
          title = this.messages.DEACTIVATE_ITEM;
          content = this.messages.ARE_YOU_SURE_DEACTIVATE;
        } else {
          title = this.messages.ACTIVEATE_ITEM;
          content = this.messages.ARE_YOU_SURE_ACTIVEATE;
        }
        this.dialogService.open(DeleteComponent, {
          context: {
            title: title + " " + subsPackage.name,
            content: content + " " + subsPackage.name,
          },
        }).onClose.subscribe((data) => {
          if(data){
            this.api.protectedGet('allowances/' + subsPackage.id + '/toggle', this.token).subscribe((data) => {
              console.log(data);
              subsPackage.is_active = !subsPackage.is_active;
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
    this.allowances = [];
    this.loaded = false;
    this.load();
  }


  onImgError(event) { 
    event.target.src = 'assets/images/placeholder.jpg';
}
}
