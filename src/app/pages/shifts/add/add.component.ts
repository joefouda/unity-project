import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-index-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
})
export class AddComponent implements OnInit {
  public myForm: FormGroup;
  messages
  shift = {
    id: '',
    name: '',
    name_ar: '',
    number_of_hours: [''],
    break_hours:'',
    type: '1',
    shift: {
      type: null,
      sun: {
        from: '08:00 AM',
        to: '04:00 PM'
      },
      mon: {
        from: '08:00 AM',
        to: '04:00 PM'
      },
      tue: {
        from: '08:00 AM',
        to: '04:00 PM'
      },
      wed: {
        from: '08:00 AM',
        to: '04:00 PM'
      },
      thu: {
        from: '08:00 AM',
        to: '04:00 PM'
      },
      fri: {
        from: '',
        to: ''
      },
      sat: {
        from: '',
        to: ''
      }
    },
  };
  submitted = false;
  loading = false;
  token;
  numberOfHours = 10;
  public message: string;
  isEdit = false;
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      number_of_hours: [''],
      name_ar: [''],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((data: any) => {
      console.log(data);
      if (data.params.id != null) {
        this.isEdit = true;
        this.shift.id = data.params.id;
        this.loadItem();
      }
    });
  }


  loadItem() {
    this.api.protectedGet('shifts/' + this.shift.id, this.token).subscribe((data : any) => {
      this.shift = data;
      this.shift.type = "" + data.shift.type + "";
      if(this.shift.type == '2'){
        this.shift.number_of_hours = data.shift.number_of_hours;
      }
    });
  }

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.shift.shift.type = this.shift.type;
    this.api.protectedPost('shifts', this.shift, this.token).subscribe((data: any) => {
        this.showSuccessMsgAndReturn();
    }, err => {
      let errMessages = this.messages.ERROR_INFO;
      if(err.error.errors != null){
        Object.keys(err.error.errors).forEach( async (key) => {
          errMessages = err.error.errors[key];
        });
      }
      this.toastrService.danger(errMessages, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      this.loading = false;
    })
  }

  showSuccessMsgAndReturn(){
    this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    this.loading = false;
    this.router.navigate(['/pages/shifts']);
  }
}
