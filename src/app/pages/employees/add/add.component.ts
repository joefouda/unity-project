import { Component, OnInit, ViewChild } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IMAGE_URL } from '../../../providers/providers';

import { NbStepperComponent } from '@nebular/theme';
@Component({
  selector: 'ngx-index-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
})
export class AddComponent implements OnInit {
  @ViewChild('stepper') stepper: NbStepperComponent;

  public myForm: FormGroup;
  iqamaImageSource:any;
  nationalIdImageSource:any;
  contractImageSource:any;
  files:{
    contract_file:'',
    iqama_file:'',
    id_file:''
  };
  picture: File
  messages
  employee = {
    id: '',
    name: '',
    employee_id: '',
    name_ar: '',
    email: '',
    mobile: '',
    identifier: '',
    joined_at: '',
    position: '',
    preferred_lang: '',
    contract_duration: '',
    contract_duration_type: 'YEARLY',
    current: 32,
    yearly_total: 32,
    urgent: 3,
    urgent_total: 3,
    date_of_birth: '',
    gender: '',
    basic_salary: '',
    department_id: '',
    allowances: [],
    work_shift: '',
    picture: ''
  };
  submitted = false;
  loading = false;
  token;
  public imagePath;
  imgURL: any;
  public message: string;
  isEdit = false;
  departments = [];
  allowances = [];
  shifts = [];
  positions = [];
  companyProfile = {
    yearly_vacation_balance: 32,
    urgent_vacation_balance: 3,
  }
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      name_ar: [''],
      employee_id: ['', [Validators.required]],
      identifier: ['', [Validators.required]],
      joined_at: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(9), Validators.minLength(9)]],
      preferred_lang: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nationalIdPhoto: [''],
      iqamaPhoto: [''],
      contractPhoto: [''],
      nationalIdExDate: [''],
      iqamaExDate: [''],
      contractExDate: [''],
      date_of_birth: [''],
      basic_salary: [''],
      gender: ['', [Validators.required]],
      current: [32, [Validators.required, Validators.max(32)]],
      yearly_total: [32, [Validators.required, Validators.max(32)]],
      urgent_total: [3, [Validators.required, Validators.max(3)]],
      urgent: [3, [Validators.required, Validators.max(3)]],
      work_shift: ['', [Validators.required]],
      contract_duration_type: ['YEARLY', [Validators.required]],
      contract_duration_period: ['', [Validators.required]],
      department_id: [''],
      picture: [''],
      position: ['', [Validators.required]],
      allowances: [''],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');

    const yearly_total = <FormControl>this.myForm.get('yearly_total');
    const current = <FormControl>this.myForm.get('current');

    yearly_total.valueChanges.subscribe(value => {
      current.setValidators([Validators.required, Validators.max(value)]);
      current.updateValueAndValidity();
    });

    const urgent_total = <FormControl>this.myForm.get('urgent_total');
    const urgent = <FormControl>this.myForm.get('urgent');

    urgent_total.valueChanges.subscribe(value => {
      urgent.setValidators([Validators.required, Validators.max(value)]);
      urgent.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id != null) {
        this.isEdit = true;
        this.employee.id = data.params.id;
        this.loadItem();
      }
    });
    this.token = localStorage.getItem('token');
    this.api.protectedGet("departments-all", this.token).subscribe((data: any) => {
      this.departments = data;
    });

    this.api.protectedGet("allowances-all", this.token).subscribe((data: any) => {
      this.allowances = data;
    });

    this.api.protectedGet("shifts-all", this.token).subscribe((data: any) => {
      this.shifts = data;
    });

    this.api.protectedGet("positions-all", this.token).subscribe((data: any) => {
      this.positions = data;
    });

    this.api.protectedGet("company-profile", this.token).subscribe((data: any) => {
      if(data != null){
        this.companyProfile = data;
        this.myForm.controls['yearly_total'].setValidators([Validators.max(this.companyProfile.yearly_vacation_balance)]);
        this.myForm.controls['current'].setValidators([Validators.max(this.companyProfile.yearly_vacation_balance)]);
        this.myForm.controls['urgent_total'].setValidators([Validators.max(this.companyProfile.urgent_vacation_balance)]);
        this.myForm.controls['urgent'].setValidators([Validators.max(this.companyProfile.urgent_vacation_balance)]);
      }
    });
  }

  changeSource(newsrc, photo){
    if(photo === 'nationalId'){
      if(!this.nationalIdImageSource){
        this.nationalIdImageSource = newsrc ?'https://api.unisync.app/storage/employees/' + newsrc:''
      }
      document.getElementById('nationalIdImagePreview').style.display = "flex";
    } else if (photo === 'iqama'){
      if(!this.iqamaImageSource){
        this.iqamaImageSource = newsrc ?'https://api.unisync.app/storage/employees/' + newsrc:''
      }
      document.getElementById('iqamaImagePreview').style.display = "flex";
    } else {
      if(!this.contractImageSource) {
        this.contractImageSource = newsrc ?'https://api.unisync.app/storage/employees/' + newsrc:''
      }
      document.getElementById('contractImagepreview').style.display = "flex";
    }
  }

  hidepreview(preview){
    document.getElementById(preview).style.display = "none";
  }


  nextOne(){
    if (this.myForm.controls['name'].valid && this.myForm.controls['identifier'].valid && this.myForm.controls['mobile'].valid && this.myForm.controls['email'].valid && this.myForm.controls['nationalIdPhoto'].valid, this.myForm.controls['iqamaPhoto'].valid, this.myForm.controls['contractPhoto'].valid, this.myForm.controls['nationalIdExDate'].valid, this.myForm.controls['iqamaExDate'].valid, this.myForm.controls['contractExDate'].valid) {
      this.submitted = false;
      this.stepper.next();
    } else {
      this.submitted = true;
    }
  }

  nextTwo(){
    if (this.myForm.controls['gender'].valid && this.myForm.controls['preferred_lang'].valid && this.myForm.controls['position'].valid && 
    this.myForm.controls['work_shift'].valid && this.myForm.controls['employee_id'].valid && this.myForm.controls['joined_at'].valid) {
      this.submitted = false;
      this.stepper.next();
    } else {
      this.submitted = true;
    }
  }


  preview(files) {
    this.imgURL = null
    files = files.target.files;
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    this.picture = files[0];

    var reader = new FileReader();
    this.imagePath = files;
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
    reader.readAsDataURL(files[0]);
  }

  loadItem() {
    this.api.protectedGet('employees/' + this.employee.id, this.token).subscribe((data : any) => {
      console.log(data);
      this.myForm.patchValue({
        nationalIdExDate: data.files[0]?.id_expire_date,
        iqamaExDate: data.files[0]?.iqama_expire_date,
        contractExDate: data.files[0]?.contract_expire_date,
      })
      this.files = data.files[0]
      this.employee = data;
      this.employee.name = data.full_name;
      this.employee.name_ar = data.full_name_ar;
      this.employee.email = data.user.email;
      this.employee.mobile = data.user.mobile.substring(4);
      this.employee.preferred_lang = data.user.preferred_lang;
      if(this.allowances.length > 0){
        data.allowances.forEach(element => {
          this.employee.allowances.push("" + element.allowance_id + "");
        });
      } else {
        setTimeout(() => {
          var x = data.allowances;
          this.employee.allowances = [];
          x.forEach(element => {
            this.employee.allowances.push("" + element.allowance_id + "");
          });
        }, 2000);
      }
      this.employee.current = data.balance.current;
      this.employee.urgent = data.balance.urgent;
      this.employee.yearly_total = data.balance.yearly_total;
      this.employee.urgent_total = data.balance.urgent_total;
      this.employee.position = "" + data.position_id + "";
      this.employee.work_shift =  "" + data.work_shift_id + "";

      if(data.department_id != null)
        this.employee.department_id = "" + data.department_id + "";

      if(this.employee.picture != null)
        this.imgURL = IMAGE_URL + "/employees/" + this.employee.picture;
    });
  }

  onFileChange(photoField,event: any) {
    const file = event.target.files[0]
    var reader = new FileReader();
    reader.onload = (_event) => {
      if(photoField === 'nationalIdPhoto'){
        this.nationalIdImageSource = reader.result
      } else if (photoField === 'iqamaPhoto'){
        this.iqamaImageSource = reader.result
      } else {
        this.contractImageSource = reader.result
      }
    }
    reader.readAsDataURL(file);
    this.myForm.get(photoField)?.setValue(file)
  }

  save() {
    this.loading = true;
    // form data for profile picture
    const uploadData = new FormData();
    
    // form data for important documents
    const uploadFiles = new FormData();
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }

    this.employee.mobile = "+966" + this.employee.mobile;
    this.api.protectedPost('employees', this.employee, this.token).subscribe((data: any) => {
      console.log(data)
      if(this.myForm.get('nationalIdPhoto')?.value){
        uploadFiles.append('id_file', this.myForm.get('nationalIdPhoto')?.value);
        uploadFiles.append('id_expire_date', this.myForm.get('nationalIdExDate')?.value);
      }
      if(this.myForm.get('iqamaPhoto')?.value){
        uploadFiles.append('iqama_file', this.myForm.get('iqamaPhoto')?.value);
        uploadFiles.append('iqama_expire_date', this.myForm.get('iqamaExDate')?.value);
      }
      if(this.myForm.get('contractPhoto')?.value){
        uploadFiles.append('contract_file', this.myForm.get('contractPhoto')?.value);
        uploadFiles.append('contract_expire_date', this.myForm.get('contractExDate')?.value);
      }

      // post documents photos and expiration dates
      this.api.protectedPost('employees/' + data.id + '/uploadFiles', uploadFiles, this.token).subscribe((res) => {
        console.log(res)
        this.loading = false
        this.showSuccessMsgAndReturn();
      }, err => {
        if(err.error.errors.id_expire_date && err.error.errors.iqama_expire_date && err.error.errors.contract_expire_date && err.error.errors.id_file && err.error.errors.iqama_file && err.error.errors.contract_file){
          this.toastrService.danger('employee files and expire dates are required', this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        } else if(err.error.errors.id_expire_date){
          this.toastrService.danger(err.error.errors.id_expire_date[0], this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        } else if (err.error.errors.iqama_expire_date) {
          this.toastrService.danger(err.error.errors.iqama_expire_date[0], this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        } else if (err.error.errors.contract_expire_date) {
          this.toastrService.danger(err.error.errors.contract_expire_date[0], this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        } else {
          this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        }
      })
      
      // post profile photo
      // if(this.picture != null){
      //   uploadData.append('image', this.picture, this.picture.name);
      //   this.api.protectedPost('employees/' + data.id + '/upload', uploadData, this.token).subscribe((data) => {
      //     this.showSuccessMsgAndReturn();
      // }, err => {
      //     this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      //     this.loading = false;
      //   })
      // } else {
      //   this.showSuccessMsgAndReturn();
      // }

    }, err => {
      let errMessages = this.messages.ERROR_INFO;
      this.employee.mobile = this.employee.mobile.substring(4);
      if(err.error.errors != null){
        Object.keys(err.error.errors).forEach( async (key) => {
          if(key == "email" || key == "mobile" || key == "identifier"){
            this.stepper.previous();
            this.stepper.previous();
          } else if(key == 'employee_id'){
            this.stepper.previous();
          }
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
    this.router.navigate(['/pages/employees']);
  }
}
