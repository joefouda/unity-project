import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n, NgbDate
} from '@ng-bootstrap/ng-bootstrap';

var moment = require('moment-hijri');
moment.locale('en-US');
import { IslamicI18n } from '../../../providers/IslamicI18n';

@Component({
  selector: 'ngx-demo-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura},
    {provide: NgbDatepickerI18n, useClass: IslamicI18n}
  ]
})
export class AddComponent implements OnInit {
  public myForm: FormGroup;
  
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  min: Date;
  messages
  leave:any = {
    id: '',
    company_vacations_id: null,
    from:'',
    to:''
  };
  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;
  date: any;
  leaveTypes = [{
    id:1,
    name:"vacation 1",
    name_ar:"عطلة 1",
    type:0,
    paid_type:0,
    percentage_for_deduction:10
  },
  ]; 

  // {
  //   id:2,
  //   name:"vacation 2",
  //   name_ar:"عطلة 2",
  //   type:1,
  //   paid_type:1,
  // }

  

  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private location: Location) {
    this.myForm = this.fb.group({
      date: [''],
      company_vacations_id: [null, [Validators.required]],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.min = new Date();
  }

  ngOnInit() {
    // this.api.protectedGet("leave-company-types", this.token).subscribe((data: any) => {
    //   this.leaveTypes = data;
    // });
    // this.route.paramMap.subscribe((data: any) => {
    //   if (data.params.id != null) {
    //     this.isEdit = true;
    //     this.leave.id = data.params.id;
    //     this.loadItem();
    //   }
    // });   
  }

  // loadItem() {
    // this.api.protectedGet('leaves/' + this.leave.id, this.token).subscribe((data:any) => {
    //   this.leave = data;
    //   this.leave.company_vacations_id = "" + this.leave.company_vacations_id + "";
    //   if(data.from != null){
    //     var tep = {
    //       start: data.from,
    //       end: data.to
    //     }
    //     this.date = tep;
    //     this.leave.date = tep;
    //   }
    // });
  // }

  save() {
    // this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    // if(this.leave.type == '2'){
    //   if(this.fromDate == null || this.toDate == null){
    //     let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
    //     this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //   }
    //   
    // } else {
    //   if(this.date == null || this.date.start == null || this.date.end == null){
    //     let errMessages = this.messages.MAKE_SURE_DATE_IS_VALID;
    //     this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //   }
    //   this.leave.date = this.date
    // }
    // this.leave.date.start = moment(this.fromDate.year + '/' + this.fromDate.month + 1 + "/" + this.fromDate.day, 'iYYYY/iM/iD HH:mm').format('YYYY-M-DTHH:mm:ss');
    // this.leave.date.end = moment(this.toDate.year + '/' + this.toDate.month + 1 + "/" + this.toDate.day, 'iYYYY/iM/iD HH:mm').format('YYYY-M-DTHH:mm:ss');
    // this.leave.date.end.setDate(this.leave.date.end.getDate() + 1);
    // this.leave.date.start.setDate(this.leave.date.start.getDate() + 1);
    this.leave.from = new Date(this.myForm.controls['date'].value.start).toLocaleDateString("fr-CA")
    this.leave.to = new Date(this.myForm.controls['date'].value.end).toLocaleDateString("fr-CA")
    this.leave = {
      ...this.leave,
      company_vacation:this.leaveTypes[0],
      employee:{full_name:"Test Employee"},
      status: { id: 1, name: "FILLED", name_ar: "مقدمة" }
    }
    localStorage.setItem("leave", JSON.stringify(this.leave))
    console.log(localStorage.getItem('leave'))
    this.showSuccessMsgAndReturn();
    // this.api.protectedPost('submitNewLeave', this.leave, this.token).subscribe((data: any) => {
    //   if(data.success){
    //     this.showSuccessMsgAndReturn();
    //   } else {
    //     this.toastrService.danger("Not enough balance", this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //     this.loading = false;
    //   }
    // }, err => {
    //   console.log(err)
    //   let errMessages = this.messages.ERROR_INFO;
    //   if(err.error.errors != null){
    //     Object.keys(err.error.errors).forEach( async (key) => {
    //       errMessages = err.error.errors[key];
    //     });
    //   }
    //   this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //   this.loading = false;
    // })
  }

  showSuccessMsgAndReturn(){
    this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    this.loading = false;
    this.location.back()
  }

  // onDateSelection(date: NgbDate) {
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromDate = date;
  //   } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
  //     this.toDate = date;
  //   } else {
  //     this.toDate = null;
  //     this.fromDate = date;
  //   }
  // }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}
