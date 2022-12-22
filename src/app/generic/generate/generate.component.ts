import { Component, OnInit, Input } from '@angular/core';
import { NbSpinnerService } from '@nebular/theme';
import { ApiService } from '../../providers/api.service'
import { IMAGE_URL } from '../../providers/providers';

@Component({
  selector: 'ngx-generate-add',
  templateUrl: 'generate.component.html',
  styleUrls: ['generate.component.scss'],
})
export class GenerateComponent implements OnInit {
  autoExpiry= false
  imageUrl = IMAGE_URL;
  token;
  companyId:String

  department = {
    id: null,
    name: '',
    name_ar: ''
  }

  company = {
    id: null,
    key: '',
    name: '',
    name_ar: '',
    picture: ''
  }
  manager = false;
  roleId;
  qrdata;
  constructor(private api: ApiService, private spinner$: NbSpinnerService) {

  }

  ngOnInit() {
    this.spinner$.load();
    this.token = localStorage.getItem('token');
    this.roleId = localStorage.getItem('roleId');
    this.manager =  this.roleId == '4' ? true : false;

    this.api.protectedGet("get-my-company", this.token).subscribe((data: any) => {
        this.company = data.company;
        if(data.department != null){
          this.department = data.department;
          this.qrdata = this.company.key + "-" + data.department.id;
        } else {
          this.qrdata = this.company.key;
        }
  
      });
    setInterval(() => {
    this.api.protectedGet("refresh-company", this.token).subscribe((data: any) => {
      this.company = data;
    });
    }, 300000); 
  }

  onImgError(event) {
    event.target.src = 'assets/images/placeholder.jpg';
  }

}
