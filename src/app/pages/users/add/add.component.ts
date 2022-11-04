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

  messages;
  user: any = {
    id: '',
    name: '',
    password: '',
    email: '',
    mobile: '',
    preferred_lang: '',
    yearly_vacation_balance: '',
    urgent_vacation_balance: '',
    includes_weekends: '',
    picture: ''
  };
  submitted = false;
  loading = false;
  token;
  employee = true;
  public imagePath;
  imgURL: any;
  public message: string;
  isEdit = false;
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      preferred_lang: ['en', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      picture: [''],
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
        this.user.id = data.params.id;
        this.loadItem();
      }
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
    this.api.protectedGet('users/' + this.user.id, this.token).subscribe((data:any) => {
      this.user = data;
      this.user.mobile = this.user.mobile.substring(4);
      if(this.user.picture != null){
        this.imgURL = IMAGE_URL + "/employee/" + this.picture;
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
    this.api.protectedPost('users', this.user, this.token).subscribe((data: any) => {
      const uploadData = new FormData();
      if(this.picture != null){
        uploadData.append('image', this.picture, this.picture.name);
        this.api.protectedPost('users/' + data.id + '/upload', uploadData, this.token).subscribe((data) => {
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
    this.router.navigate(['/pages/users']);
  }
}
