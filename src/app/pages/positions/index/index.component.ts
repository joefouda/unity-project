import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit{
  token;
  positions = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  isDone = false;
  messages;

  query = {
    name: '',
    is_active: '',
  }
  q = "";
  totalItems;

  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();
  }


  setPage(pageNumber){
    this.page = pageNumber;
    this.positions = [];
    this.loaded = false;
    this.scrollService.scrollTo(0,0);
    this.load();
  }

  load(){
    this.api.protectedGet("positions?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.positions = data.data;
      this.loaded = true;
      this.fakeItems = [];
    }, err => {
      if(err.status == 401){
        localStorage.setItem('token', null);
        this.router.navigate(['/auth/login']);
      }
    });
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
            this.api.protectedDelete('positions/' + subsPackage.id, this.token).subscribe((data) => {
              this.positions.splice(index, 1);
              this.totalItems--;
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
