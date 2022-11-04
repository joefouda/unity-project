import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IMAGE_URL } from '../../../providers/providers';

@Component({
  selector: 'ngx-index-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
})
export class AddComponent implements OnInit {
  public myForm: FormGroup;
  picture: File

  messages
  company: any = {
    id: '',
    pending_registration_id: '',
    name: '',
    name_ar: '',
    manager: {
      name: '',
      email: '',
      mobile: '',
      preferred_lang: 'en'
    },
    subscription_package_id: '',
    starting_date: '',
    picture: ''
  };
  submitted = false;
  loading = false;
  token;
  public imagePath;
  imgURL: any;
  public message: string;
  isEdit = false;
  packages = [];
  
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      name_ar: [''],
      manager_mobile: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      manager_name: ['', [Validators.required]],
      manager_lang: ['en', [Validators.required]],
      manager_email: ['', [Validators.required, Validators.email]],
      picture: [''],
      subscription_package_id: [''],
      starting_date: [''],
    });

    this.translate.get('TOAST_MESSAGES')
      .subscribe((data) => {
        this.messages = data;
      });
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.route.paramMap.subscribe((data: any) => {
      if (data.params.id != null) {
        this.isEdit = true;
        this.company.id = data.params.id;
        this.loadItem();
      }
      if (data.params.accept != null) {
        this.company.pending_registration_id = data.params.accept;
        this.loadPendingItem();
      }
    });

    this.loadPackages();
  }

  loadPackages(){
    this.api.protectedGet('packages-all', this.token).subscribe((data: any) => {
      this.packages = data;
    });
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
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  loadItem() {
    this.api.protectedGet('companies/' + this.company.id, this.token).subscribe((data: any) => {
      this.company = data;
      if(this.company.manager != null){
        this.company.manager.mobile = data.manager.mobile.substring(4);
      } else {
        this.company.manager = {
          name: '',
          email: '',
          mobile: '',
          preferred_lang: 'en'
        };
      }
     
      if(this.company.picture != null)
        this.imgURL = IMAGE_URL + "/companies/" + this.company.picture;
        
      if(data.latest_sub.length > 0)
        this.company.starting_date = data.latest_sub[0].starts_in;
    });
  }

  loadPendingItem() {
    this.api.protectedGet('pending-registration/' + this.company.pending_registration_id, this.token).subscribe((data: any) => {
      this.company.name = data.name;
      this.company.manager.email = data.email;
      this.company.manager.mobile = data.mobile;
    });
  }

  getPeriod(period){
    if(period == 1){
      return "Monthly";
    } else if(period == 2){
      return "Every 6 months";
    } else {
      return "Yearly";
    }
  }

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.api.protectedPost('companies', this.company, this.token).subscribe((data: any) => {
      const uploadData = new FormData();
      if(this.picture != null){
        uploadData.append('image', this.picture, this.picture.name);
        this.api.protectedPost('companies/' + data.id + '/upload', uploadData, this.token).subscribe((data) => {
          this.showSuccessMsgAndReturn();
      }, err => {
          this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
          this.loading = false;
        })
      } else {
        this.showSuccessMsgAndReturn();
      }
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
    this.router.navigate(['/pages/companies']);
  }
}
