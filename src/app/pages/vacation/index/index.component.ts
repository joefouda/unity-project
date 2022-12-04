import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {
  token;
  title;
  messages;
  data = [];
  loadingIndicator = true;
  ColumnMode = ColumnMode;
  page = new Page();
  stats = {
    rejected: '',
    currently: '',
    pending: '',
  }
  loading = true;
  backendPage = 0;

  query = {
    name: '',
    is_active: '',
  }
  q = "";
  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,) {
      this.page.pageNumber = 0;
      this.page.size = 10;
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.getResult({ offset: 0 });
  }


  getResult(pageInfo) {
    let companyId = JSON.parse(localStorage.getItem('user')).company_id
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    this.api.protectedGet("getAllCompanyVacations?company_id=" + companyId, this.token).subscribe((data: any) => {
      console.log(data)
      this.data = data.data;
      this.page.totalElements = data.total;
      this.loadingIndicator = false;
    });
  }



  cancel(item){
    console.log(item)
    this.translate.get('TOAST_MESSAGES')
    .subscribe((data) => {
      this.messages = data;
      this.dialogService.open(DeleteComponent, {
        context: {
          title: this.messages.DELETE_ITEM + " " + item.name,
          content: this.messages.ARE_YOU_SURE_DELETE + " " + item.name ,
        },
      }).onClose.subscribe((data) => {
        if (data) {
          this.api.protectedPost('destroyCompanyVacation',{id:item.id}, this.token).subscribe((data) => {
            let temp = [...this.data];
            let index = temp.indexOf(item, 0);
            temp.splice(index, 1);
            this.data = temp;
            this.page.totalElements--;
            this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          }, err => {
            this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
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
    this.getResult({ offset: 0 });
  }


  create() {
    this.router.navigate(['/pages/vacations/add/']);
  }

  edit(id) {
    this.router.navigate(['/pages/vacations/edit/' + id]);
  }

}