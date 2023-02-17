import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
// import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'ngx-demo-index',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  exportAsConfig: ExportAsConfig = {
    type: 'xlsx', 
    elementIdOrContent: 'myTableElementId', 
    options: { // html-docx-js document options
      margin:       1,
      jsPDF:        { orientation: 'landscape' },
    }
  }
  allLeaves = [];
  exported = false;
  token;
  employee = false;
  title;
  activeText = "Active";
  inActiveText = "Inactive";
  loadingIndicator = true;
  data;
  rows = [];
  statuses = [
    {
      id:1,
      value:'pending' 
    },{
      id:2,
      value:'approved ' 
    },{
      id:3,
      value:'rejected' 
    },{
      id:4,
      value:'currently' 
    }
  ]
  messages;
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
    vacation_type_id: '',
    statusId:''
  }
  q = "";
  leaveTypes = [];
  peopleLoading = false;
  employees = [];
  employeeIds = [];
  range;
  rangeQ = {
    start: '',
    end: '',
  }
  exporting = false;
  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private exportAsService: ExportAsService,
    private toastrService: NbToastrService,
    private router: Router) {
      this.page.pageNumber = 0;
      this.page.size = 10;
  }

  ngOnInit(): void {
    // this.token = localStorage.getItem('token');
    // this.employee = localStorage.getItem('roleId') != '2' ? true : false;
    // if(!this.employee){
    //   this.api.protectedGet('leaves-stats', this.token).subscribe((data:any) => {
    //     this.stats = data;
    //     this.loading = false;
    //   });
    // }
    // this.getResult({ offset: 0 });
    // this.api.protectedGet("leave-types", this.token).subscribe((data: any) => {
    //   this.leaveTypes = data;
    // });
  }

  searchE(q){
  //   this.peopleLoading = true;
  //   this.api.protectedGet('employees-search?q=' + q.term, this.token).subscribe((data: any) => {
  //     this.employees = data;
  //     this.peopleLoading = false;
  //   }) 
  }

  export() {
  //   this.exporting = true;
  //   this.api.protectedGet("leaves-all?from=" + this.rangeQ.start + "&to=" + this.rangeQ.end + 
  //   "&vacation_type_id=" + this.query.vacation_type_id +
  //   "&employee_ids=" + this.employeeIds.toString(), this.token).subscribe((data: any) => {
  //     this.allLeaves = data;
  //     this.exported = true;
  //     setTimeout(() => {
  //       this.exportAsService.save(this.exportAsConfig, 'Leaves sheets').subscribe(() => {
  //         setTimeout(() => {
  //           this.exporting = false;
  //         }, 200);
  //       });
  //     }, 100);
  //   });
  }


  getResult(pageInfo) {
    // this.page.pageNumber = pageInfo.offset;
    // this.backendPage = this.page.pageNumber + 1;
    // this.api.protectedGet("leaves?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
    //   console.log(data)
    //   this.data = data.data;
    //   this.page.totalElements = data.total;
    //   this.loadingIndicator = false;
    // });
  }

  getSearchResult(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.backendPage = this.page.pageNumber + 1;
  //   this.api.protectedGet("leaves-search?page=" + this.backendPage + 
  //   "&from=" + this.rangeQ.start + "&to=" + this.rangeQ.end + 
  //   "&vacation_type_id=" + this.query.vacation_type_id +
  //   "&employee_ids=" + this.employeeIds.toString() +
  //   "&vacation_status_id=" + this.query.statusId, this.token).subscribe((data: any) => {
  //     this.data = data.data;
  //     this.page.totalElements = data.total;
  //     this.loadingIndicator = false;
  //   });
  }
  
  edit(id) {
    // this.router.navigate(['/pages/leaves/edit/' + id]);
  }


  accept(item){
    // console.log(item)
    // this.translate.get('TOAST_MESSAGES')
    // .subscribe((data) => {
    //   this.messages = data;
    //   this.dialogService.open(DeleteComponent, {
    //     context: {
    //       title: this.messages.ACCEPT_ITEM_LEAVE + " " + item.company_vacation.name + " " + 
    //       this.messages.FROM + " " + item.from + " " + this.messages.TO + " " + item.to,
    //       content: this.messages.ARE_YOU_SURE_ACCEPT + " " + item.company_vacation.name + " FROM " + item.from + " To " + item.to,
    //     },
    //   }).onClose.subscribe((data) => {
    //     if (data) {
    //       this.api.protectedGet('leaves-accept/' + item.id, this.token).subscribe((data: any) => {
    //         let index = this.data.indexOf(item, 0);
    //         this.data[index].status = data;
    //         this.data[index].vacation_status_id = data.id;
    //         this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       }, err => {
    //         this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       })
    //     }
    //     console.log(data);
    //   });
    // });
  }

  reject(item){
    // this.translate.get('TOAST_MESSAGES')
    // .subscribe((data) => {
    //   this.messages = data;
    //   this.dialogService.open(DeleteComponent, {
    //     context: {
    //       title: this.messages.REJECT_ITEM_LEAVE + " " + item.company_vacation.name + " FROM " + item.from + " To " + item.to,
    //       content: this.messages.ARE_YOU_SURE_REJECT + " " + item.company_vacation.name + " FROM " + item.from + " To " + item.to,
    //     },
    //   }).onClose.subscribe((data) => {
    //     if (data) {
    //       this.api.protectedGet('leaves-reject/' + item.id, this.token).subscribe((data) => {
    //         let index = this.data.indexOf(item, 0);
    //         this.data.splice(index, 1);
    //         this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       }, err => {
    //         this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       })
    //     }
    //     console.log(data);
    //   });
    // });
  }

  cancel(item){
    // this.translate.get('TOAST_MESSAGES')
    // .subscribe((data) => {
    //   this.messages = data;
    //   this.dialogService.open(DeleteComponent, {
    //     context: {
    //       title: this.messages.DELETE_ITEM + " " + item.company_vacation.name + " FROM " + item.from + " To " + item.to,
    //       content: this.messages.ARE_YOU_SURE_DELETE + " " + item.company_vacation.name + " FROM " + item.from + " To " + item.to,
    //     },
    //   }).onClose.subscribe((data) => {
    //     if (data) {
    //       this.api.protectedDelete('leaves/' + item.id, this.token).subscribe((data) => {
    //         console.log(data)
    //         let temp = [...this.data];
    //         let index = temp.indexOf(item, 0);
    //         temp.splice(index, 1);
    //         this.data = temp;
    //         this.page.totalElements--;
    //         this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       }, err => {
    //         console.log(err)
    //         this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       })
    //     }
    //   });
    // });
  }

  search(){
    // if(this.range != null){
    //   this.rangeQ.start = new Date(this.range.start).toISOString().slice(0, 10)
    //   this.rangeQ.end = new Date(this.range.end).toISOString().slice(0, 10)
    // }
    // this.getSearchResult({ offset: 0 });
  }

}
