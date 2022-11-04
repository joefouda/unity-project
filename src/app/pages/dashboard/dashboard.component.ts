import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../providers/api.service'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  role;
  loading = true;
  loadingAttendance = true;
  token;
  stats = {
    yearly_leaves_remaining: 0,
    yearly_leaves_remaining_perc: '',
    yearly_total: 0,
    urgent_total: 0,
    urgent_leaves_remaining_perc: '',
    urgent_leaves_remaining: 0,
    total_salary: 0,
    loggedInToday: 0,
    total_delays: {
      hours: 0,
      minutes: 0,
    },
    employees: 0,
    employees_remaining_perc: '',
    employees_remaining: 0,
    departments: 0,
    on_duty_now: 0,
    salaries: 0
  };
  attendances;
  loggedInToday;

  inCard: CardSettings = {
    title: 'Log in',
    iconClass: 'nb-checkmark',
    type: 'primary',
  };
  outCard: CardSettings = {
    title: 'Log out',
    iconClass: 'nb-close',
    type: 'danger',
  };
  todaysOff;
  todaysOn;
  private scannerEnabled: boolean = false;
  typeOfScan;
  todaysId;
  key;
  depId;
  employee = false;
  messages;
  loggedIn = '';
  loggedOut = '';
  gotFoodics = false;
  connecting = false;
  constructor(
    private api: ApiService,
    private toastrService: NbToastrService,
    private router: Router,
    private translate: TranslateService,
  ) {

  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.role = localStorage.getItem('roleId');
    this.employee = this.role == '3' || this.role == '4'
    this.api.protectedGet("stats", this.token).subscribe((data: any) => {
      this.stats = data;
      if(this.employee){
        this.stats.yearly_leaves_remaining_perc = ((this.stats.yearly_leaves_remaining / this.stats.yearly_total) * 100).toFixed(1);
        this.stats.urgent_leaves_remaining_perc = ((this.stats.urgent_leaves_remaining / this.stats.urgent_total) * 100).toFixed(1);
      } else if(this.role == '2'){
        this.gotFoodics = data.company.foodics_enabled
        this.stats.employees_remaining = data.company.package.max_number_of_employees - this.stats.employees;
        this.stats.employees_remaining_perc = (( this.stats.employees / data.company.package.max_number_of_employees) * 100).toFixed(1);
      }
      this.loading = false;
    }, err => {
      if (err.status == 401) {
        this.router.navigate(['/auth/login']);
      }
      console.log(err);
    });
    if (this.employee) {
      this.translate.get(['TOAST_MESSAGES', 'LOG_IN', 'LOG_OUT', 'LOGGED_IN', 'LOGGED_OUT'])
      .subscribe((data) => {
        this.outCard.title = data.LOG_OUT;
        this.inCard.title = data.LOG_IN;
        this.loggedIn = data.LOGGED_IN;
        this.loggedOut = data.LOGGED_OUT;
      });
      this.api.protectedGet("attendance-sheets-last-days", this.token).subscribe((data: any) => {
        this.attendances = data;
        if (this.attendances.length > 0) {
          
          let todayDate = new Date();
          let todayDateText = todayDate.getFullYear() + '-' + ('0' + (todayDate.getMonth()+1)).slice(-2) + '-' + ('0' + (todayDate.getDate())).slice(-2)
          let inAt = this.attendances[0].in.split(' ');

          if (this.attendances[0].out != null) {
            let outAt = this.attendances[0].out.split(' ');
            if (outAt[0] == todayDateText) {
              this.todaysOff = this.attendances[0].out;
              this.outCard.title = this.loggedOut;
            }
          }
          if (inAt[0] == todayDateText) {
            this.todaysId = this.attendances[0].id;
            this.todaysOn = this.attendances[0].in;
            this.inCard.title = this.loggedIn;
          }

        }
        this.loadingAttendance = false;
      });
    }

  }

  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.key = $event;
    console.log($event);
    let depCut = this.key.split("-");
    if(depCut.length > 1){
      this.depId = depCut[1];
    }
    if (this.typeOfScan == 1) {
      this.actualLogin();
    } else {
      this.actualLogout();
    }
  }

  logIn() {
    if (this.todaysOn == null) {
      this.typeOfScan = 1;
      this.scannerEnabled = !this.scannerEnabled;
    }
  }

  logout() {
    if (this.todaysOff == null) {
      this.typeOfScan = 2;
      this.scannerEnabled = !this.scannerEnabled;
    }
  }

  actualLogin() {
    if (this.todaysOn == null) {
      this.loadingAttendance = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          this.api.protectedPost("attendance-sheet/log-in", { longitude: longitude, latitude: latitude, key: this.key, depId: this.depId }, this.token).subscribe((data: any) => {
            this.todaysOn = new Date();
            this.todaysId = data.id;
            this.loadingAttendance = false;
            this.refreshData();
            this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          }, err => {
            this.loadingAttendance = false;
            this.toastrService.danger("Expired barcode", "Kindly Scan a newer barcode", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          })
        }, (err) => {
          this.toastrService.danger("Unable to aquire location", "Kindly open GPS", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        });
      } else {
        this.toastrService.danger("Unable to aquire location", "Kindly open GPS", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      }
    }
  }

  actualLogout() {
    if (this.todaysOff == null) {
      this.loadingAttendance = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          this.api.protectedPost("attendance-sheet/log-off", { id: this.todaysId, longitude: longitude, latitude: latitude, key: this.key }, this.token).subscribe((data: any) => {
            this.todaysOff = new Date();
            this.todaysId = data.id;
            this.loadingAttendance = false;
            this.refreshData();
            this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          }, err => {
            this.loadingAttendance = false;
            this.toastrService.danger("Expired barcode", "Kindly Scan a newer barcode", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          })
        }, (err) => {
          this.toastrService.danger("Unable to aquire location", "Kindly open GPS", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        });
      } else {
        this.toastrService.danger("Unable to aquire location", "Kindly open GPS", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      }
    }
  }

  refreshData() {
    this.api.protectedGet("attendance-sheets-last-days", this.token).subscribe((data: any) => {
      this.attendances = data;
    });
  }

  linkFoodics(){
    this.api.protectedGet("foodics", this.token).subscribe((data: any) => {
      this.connecting = true;
      localStorage.setItem('got_data_foodics', null);
      window.open(data.link, "_blank");


      clearInterval()
      let interval = setInterval(() => {
        let foodicsData = localStorage.getItem('got_data_foodics');
        if(foodicsData != null){
          this.connecting = false;
          this.gotFoodics = true;
          localStorage.setItem('got_data_foodics', null);
          clearInterval(interval);
          this.toastrService.primary("Connecting succesffuly", "Thanks!", { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
        }
      }, 50000);
      
    });
  }
}
