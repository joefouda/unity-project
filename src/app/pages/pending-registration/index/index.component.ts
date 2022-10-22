import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
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
  @ViewChild(DatatableComponent) table: DatatableComponent;

  token;
  employee = false;
  title;
  activeText = "Active";
  inActiveText = "Inactive";
  loadingIndicator = true;
  data;
  columns = [];
  messages;
  ColumnMode = ColumnMode;
  temp = [];
  page = new Page();
  stats = {
    rejected: '',
    pending: '',
    total: '',
    accepted: ''
  }
  loading = true;
  date: any;
  backendPage = 0;
  scrollBarHorizontal = true;

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
    this.api.protectedGet('pending-registration-stats', this.token).subscribe((data: any) => {
      this.stats = data;
      this.loading = false;
    });
    this.getResult({ offset: 0 });
  }


  getResult(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.backendPage = this.page.pageNumber + 1;
    setTimeout(() => {
      this.loadingIndicator = false;
    }, 300);
    this.api.protectedGet("pending-registration?page=" + this.backendPage, this.token).subscribe((data: any) => {
      this.data = data.data;
      this.page.totalElements = data.total;
    });
  }

  onDeleteConfirm(event) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + event.data.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + event.data.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('pending-registration/' + event.data.id, this.token).subscribe((data) => {
              this.data.remove(event.data);
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
            })
          }
          console.log(data);
        });
      });
  }


  
  updateFilter(event) {

  }

  accept(id) {
    // this.router.navigate(['/pages/companies/add/' + id]);
    this.loading = true
    this.translate.get('TOAST_MESSAGES')
      .subscribe((mData) => {
        this.messages = mData;
        this.api.protectedPost('pending-registration-status/' + id, {status:1}, this.token).subscribe((res) => {
          console.log(res)
          this.api.protectedGet('pending-registration-stats', this.token).subscribe((data: any) => {
            this.stats = data;
            this.loading = false;
            this.getResult({ offset: this.page.pageNumber });
            this.toastrService.success("user accepted successfully", this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          });
        }, err => {
          this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        })
      })
  }

  resendActivation(id) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((mData) => {
        this.messages = mData;
        this.api.protectedGet('resend-activiation/' + id, this.token).subscribe((data:any) => {
          this.toastrService.success(data.msg, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        }, err => {
          this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        })
      })
  }

  reject(id) {

  }

  cancel(item) {
    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
        this.dialogService.open(DeleteComponent, {
          context: {
            title: this.messages.DELETE_ITEM + " " + item.name,
            content: this.messages.ARE_YOU_SURE_DELETE + " " + item.name,
          },
        }).onClose.subscribe((data) => {
          if (data) {
            this.api.protectedDelete('pending-registration/' + item.id, this.token).subscribe((data) => {
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
}
