import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from '../../../providers/api.service'
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { DeleteComponent } from '../../modal-overlays/delete/delete.component'
import { NbToastrService, NbGlobalPhysicalPosition, NbLayoutScrollService } from '@nebular/theme';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'index.component.html',
  styleUrls: ['index.component.scss'],
})
export class IndexComponent implements OnInit{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  exportAsConfig: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'myTableElementId',
  }
  token;
  departments = [];
  loaded = false;
  fakeItems: Array<any> = new Array(12);
  page = 1;
  allData = [];
  totalPages;
  totalItems;
  lastPage;
  perPage;
  query = {
    name: '',
  }
  q = "";
  exported = false;
  exporting = false;
  messages;
  employees = [];
  loadingEmployees = false;
  constructor(
    private api: ApiService,
    private translate: TranslateService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private scrollService: NbLayoutScrollService,
    private modal: NgbModal,
    private exportAsService: ExportAsService) {
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.load();
  }
 

  load() {
    this.api.protectedGet("departments?page=" + this.page + this.q, this.token).subscribe((data: any) => {
      this.loaded = true;
      this.departments = data.data;
      this.totalItems = data.total;
      this.perPage = data.per_page;
      this.lastPage = data.last_page;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  setPage(pageNumber) {
    if(pageNumber > 0){
      this.page = pageNumber;
      this.departments = [];
      this.loaded = false;
      this.scrollService.scrollTo(0, 0);
      this.load();
    }
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
            this.api.protectedDelete('departments/' + subsPackage.id, this.token).subscribe((data) => {
              this.departments.splice(index, 1);
              this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            }, err => {
              this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT});
            })
          }
          console.log(data);
        });
      });
  }


  export() {
    this.exporting = true;
    this.api.protectedGet("departments-all", this.token).subscribe((data: any) => {
      this.allData = data;
      this.exported = true;
      setTimeout(() => {
        this.exportAsService.save(this.exportAsConfig, 'Departments sheets').subscribe(() => {
          setTimeout(() => {
            this.exporting = false;
          }, 200);
        });
      }, 100);
    });
  }

  search() {
    const entries = Object.entries(this.query);
    this.q = "";
    for (const [key, value] of entries) {
      this.q += "&" + key + "=" + value
    }
    this.page = 1;
    this.load();
  }

  reset() {
    this.q = "";
    this.query.name = "";
    this.load();
  }

  viewEmployees(i, item){
    this.loadingEmployees = true;
    this.employees = [];
    this.modal.open(this.modalContent, { size: 'lg' });
    this.api.protectedGet("department-employees/" + item.id, this.token).subscribe((data: any) => {
      this.employees = data;
      this.loadingEmployees = false;
      
    });
  }


  onImgError(event) {
    event.target.src = 'assets/images/placeholder.jpg';
  }

 
}
