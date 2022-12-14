import { Component } from '@angular/core';
import { MENU_ITEMS_FOR_ADMIN, MENU_ITEMS_FOR_MANAGER, MENU_ITEMS_FOR_EMPLOYEE } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';
import { NbLayoutDirectionService, NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" [autoCollapse]="true"></nb-menu>
      <router-outlet>
      </router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu;
  roleId;
  theme;
  constructor(private translate: TranslateService,
    nbLayoutDirection: NbLayoutDirectionService,
    themeService: NbThemeService,
    ) {
    this.roleId = localStorage.getItem('roleId');
    
    
    this.theme = localStorage.getItem('theme');
    if(this.theme != null){
      themeService.changeTheme(this.theme);
    }
    nbLayoutDirection.onDirectionChange()
    .subscribe((direction) => {
      if(this.roleId == 1){
        this.menu = MENU_ITEMS_FOR_ADMIN;
        this.fillMenuLabelForAdmin();
      } else if(this.roleId == 2){
        this.menu = MENU_ITEMS_FOR_MANAGER;
        this.fillMenuLabelForManager();
      } else if(this.roleId == 3 || this.roleId == 4){
        this.menu = MENU_ITEMS_FOR_EMPLOYEE;
        this.fillMenuLabelForEmployee();
      }
    });
  }


  fillMenuLabelForAdmin(){
    this.translate.get('MENU_ITEMS')
      .subscribe((data) => {
        this.menu[0].title = data.DASHBOARD;
        this.menu[1].title = data.COMPANIES;
        this.menu[2].title = data.USERS;
        this.menu[3].title = data.PACKAGES;
        this.menu[4].title = data.PENDING_REGISTRATION;
        this.menu[5].title = data.SUBSCRIPTION_HISTORY;
        this.menu[6].title = data.SUPPORT;
        this.menu[7].title = data.BILLING;

      });
  }

  fillMenuLabelForManager(){
    this.translate.get('MENU_ITEMS')
      .subscribe((data) => {
        this.menu[0].title = data.DASHBOARD;
        this.menu[1].title = data.DEPARTMENTS;
        this.menu[2].title = data.EMPLOYEES;
        this.menu[3].title = data.LEAVES;
        this.menu[4].title = data.ATTENDANCE_HISTORY;
        this.menu[5].title = data.SHIFTS;
        this.menu[6].title = data.PAYROLL;
        this.menu[7].title = data.allowances;
        this.menu[8].title = data.POSITIONS;
        this.menu[9].title = data.HOLIDAYS;
        this.menu[10].title = data.VACATIONS;
        this.menu[11].title = data.NOTIFICATIONS;
        this.menu[12].title = data.CHAT;
        this.menu[13].title = data.CALENDAR;
        this.menu[14].title = data.COMPANY_SETTINGS;
        this.menu[15].title = data.HIERARCHY;
        this.menu[16].title = data.BRANCHES;
        this.menu[17].title = data.BILLING;

      });
  }

  fillMenuLabelForEmployee(){
    this.translate.get('MENU_ITEMS')
      .subscribe((data) => {
        this.menu[0].title = data.DASHBOARD;
        this.menu[1].title = data.ATTENDANCE_HISTORY;
        this.menu[2].title = data.LEAVES;
        this.menu[3].title = data.NOTIFICATIONS;
        this.menu[4].title = data.CHAT;
        this.menu[5].title = data.CALENDAR;
        this.menu[6].title = data.HIERARCHY;
        this.menu[7].title = data.PAYROLL;
      });
  }
}
