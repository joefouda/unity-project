import { Component, OnInit, Renderer2 } from '@angular/core';
import { NbSpinnerService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../providers/api.service'
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'app/models/page';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'ngx-foodics-success-add',
  templateUrl: 'foodics-success.component.html',
  styleUrls: ['foodics-success.component.scss'],
})
export class FoodicsSuccessComponent implements OnInit {

  token;
  code;
  connecting = true;
  error = false;
  gotData = false;
  showSuccess = false;
  page = new Page();
  users;
  branches;
  page2 = new Page();
  ColumnMode = ColumnMode;
  selected = [];
  selectedBranches = [];
  columns = [];
  columnsBranches = [];
  importing = false;
  usersPage = 1;
  branchesPage = 1;

  
  constructor(private api: ApiService, private renderer: Renderer2,
    private translate: TranslateService, private spinner$: NbSpinnerService, private router: Router, private route: ActivatedRoute) {
    this.page.pageNumber = 0;
    this.page.size = 10;

    this.page2.pageNumber = 0;
    this.page2.size = 10;

    this.columns = [
      {
        prop: 'selected',
        name: '',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizable: false,
        headerCheckboxable: true,
        checkboxable: true,
        width: 30
      },
      { prop: 'name' },
      { prop: 'email' },
    ]

    this.columnsBranches = [
      {
        prop: 'selected',
        name: '',
        sortable: false,
        canAutoResize: false,
        draggable: false,
        resizable: false,
        headerCheckboxable: true,
        checkboxable: true,
        width: 30
      },
      { prop: 'name' },
    ]
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'body-gray');
    this.spinner$.load();
    this.token = localStorage.getItem('token');


    this.route.queryParams.subscribe((data: any) => {
      this.code = data['code'];
      if (this.code != null) {
        this.api.protectedGet("connect-foodics?code=" + this.code, this.token).subscribe((data: any) => {
          if (data.status) {
            this.syncFoodicsUsers();
            this.syncFoodicsBranches();
            localStorage.setItem('got_data_foodics', "true");
          } else {
            this.connecting = false;
            this.error = true;
          }
        }, err => {
          this.connecting = false;
          this.error = true;
          console.log(err);
        });
      }
    });
  }


  onSelect(row) {
    console.log(row)
  }

  importToFoodics(){
    this.importing = true;
    this.api.protectedPost("add-foodics-data", {users: this.selected, branches: this.selectedBranches} , this.token).subscribe((data: any) => {
      if(data.status){
        setTimeout(() => {
          this.showSuccess = true;
          this.importing = false;
          setTimeout(() => {
            this.router.navigate(['/pages']);
          }, 2000);
        }, 2000);
      }  else {
        this.importing = false;
        this.error = true;
      }
    });
  }

  syncFoodicsUsers(){
    this.api.protectedGet("sync-foodics-users?page=" + this.usersPage, this.token).subscribe((data: any) => {
      if (data.status) {
        this.users = [...data.users.data]; 
        this.page.totalElements = data.users.meta.total;
        if(data.users.meta.total > data.users.meta.per_page){
          this.usersPage++;
          this.syncFoodicsUsers();
        }
        this.gotData = true;
        this.connecting = false;
      } else {
        this.connecting = false;
        this.error = true;
      }
    });
  }

  syncFoodicsBranches(){
    this.api.protectedGet("sync-foodics-branches?page=" + this.branchesPage, this.token).subscribe((data: any) => {
      if (data.status) {
        this.branches = [...data.branches.data]; 
        this.page2.totalElements = data.branches.meta.total;
        if(data.branches.meta.total > data.branches.meta.per_page){
          this.branchesPage++;
          this.syncFoodicsBranches();
        }
        this.gotData = true;
        this.connecting = false;
      } else {
        this.connecting = false;
        this.error = true;
      }
    });
  }
}
