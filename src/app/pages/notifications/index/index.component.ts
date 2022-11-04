import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {

  loadingIndicator = true;
  data;
  ColumnMode = ColumnMode;
  page = new Page();
  activeText = "Active";
  inActiveText = "Inactive";
  columns = [];
  messages;
  token;
  type;
  name;
  title;
  titles;
  backendPage = 0;
  query = {
    name: '',
  }
  q = "";
  isArabic = false;
  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    ) {
    this.page.pageNumber = 1;
    this.page.size = 21;
    this.isArabic = this.translate.currentLang == 'ar';
    this.translate.get(['TOAST_MESSAGES', 'MENU_ITEMS'])
      .subscribe((data) => {
        this.messages = data.TOAST_MESSAGES;
        this.titles = data.MENU_ITEMS;

      });
    this.token = localStorage.getItem('token');
  }





  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getResult({ offset: 0 });
  }

  getResult(pageInfo) {
    this.loadingIndicator = true;
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("notifications?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 300);
    });
  }


  onDeleteConfirm(event) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + event.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + event.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('notifications/' + event.id, this.token).subscribe((data) => {
              let temp = [...this.data];
              let index = temp.indexOf(event, 0);
              temp.splice(index, 1);
              this.data = temp;
              this.page.totalElements--;
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
        });
      });
  }

  search(){
    const entries = Object.entries(this.query);
    
    this.q = "";
    for (const [key, value] of entries) {
      this.q += "&" + key + "=" + value
    }
    this.getResult({ offset: 0 });
  }
}
