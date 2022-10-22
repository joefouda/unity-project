import { Component, OnInit, ViewChild, TemplateRef} from "@angular/core";
import { ApiService } from '../../../providers/api.service'
import { IMAGE_URL } from '../../../providers/providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mwl-demo-component',
  styleUrls: ['hierarchy.component.scss'],
  templateUrl: 'hierarchy.component.html',
})
export class HierarchyComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    private translate: TranslateService,
  ) {}
  token;
  messages;
  loading = true;
  name = '';
  email = '';
  mobile = '';
  position = '';
  nodes = [
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: '',
      email: '',
      mobile: '',
      title: 'Chief Executive Officer',
      childs: [
        
      ]
    }
  ];

  async ngOnInit() {
    this.messages = await this.translate.get('HIERARCHY_PAGE').toPromise();
    this.token = localStorage.getItem('token');
    this.api.protectedGet("hierarchy", this.token).subscribe((data: any) => {
      this.nodes[0].name = data.company.manager.name;
      this.nodes[0].email = data.company.manager.email;
      this.nodes[0].mobile = data.company.manager.mobile;
      this.nodes[0].title = this.messages.DIRECTOR;
      this.nodes[0].image = IMAGE_URL + "/companies/" + data.company.picture;
      let manager = {
        email: '',
        mobile: '',
        position: '',
        name: '',
      }
      for (let index = 0; index < data.departments.length; index++) {
        if(data.departments[index].manager != null){
          if(data.departments[index].manager != null){
            manager.email = data.departments[index].manager.user.email;
            manager.mobile = data.departments[index].manager.user.mobile;
            manager.position = data.departments[index].manager.position != null ? data.departments[index].manager.position.name : "";
            manager.name = this.messages.MANAGED_BY  + " " + data.departments[index].manager.full_name;
          }
        }
        this.nodes[0].childs.push({
          name: data.departments[index].name + " | " + data.departments[index].name_ar,
          cssClass: 'ngx-org-ceo departmeet',
          image: 'assets/images/sections.svg',
          email: manager.email,
          mobile: manager.mobile,
          position: manager.position,
          title:  manager.name,
          childs: [],
        });
        for (let z = 0; z < data.departments[index].employees.length; z++) {
          if(data.departments[index].employees[z].id != data.departments[index].manager.id){
            this.nodes[0].childs[index].childs.push({
              name: data.departments[index].employees[z].full_name,
              cssClass: 'ngx-org-ceo',
              email: data.departments[index].employees[z].user.email,
              mobile: data.departments[index].employees[z].user.mobile,
              image: IMAGE_URL + "/employees/" + data.departments[index].employees[z].picture,
              title: data.departments[index].employees[z].position != null ? data.departments[index].employees[z].position.name : '',
              position: data.departments[index].employees[z].position != null ? data.departments[index].employees[z].position.name : '',
              childs: [],
            });
          }
        }
        for (let z = 0; z < data.departments[index].children.length; z++) {
          manager = {
            email: '',
            mobile: '',
            position: '',
            name: '',
          };
          if(data.departments[index].children[z].manager != null){
            if(data.departments[index].children[z].manager != null){
              manager.email = data.departments[index].children[z].manager.user.email;
              manager.mobile = data.departments[index].children[z].manager.user.mobile;
              manager.position = data.departments[index].children[z].manager.position != null ? data.departments[index].children[z].manager.position.name : "";
              manager.name = this.messages.MANAGED_BY  + " " + data.departments[index].children[z].manager.full_name;
            }
          }
          
          var testRowIndex =  this.nodes[0].childs[index].childs.push({
              id: data.departments[index].children[z].id,
              name: data.departments[index].children[z].name + " | " + data.departments[index].children[z].name_ar,
              cssClass: 'ngx-org-ceo departmeet',
              image: 'assets/images/sections.svg',
              email: manager.email,
              mobile: manager.mobile,
              position: manager.position,
              title:  manager.name,
              childs: [],
            }) - 1;
            for (let f = 0; f < data.departments[index].children[z].employees.length; f++) {
              if(data.departments[index].children[z].employees[f].id != data.departments[index].children[z].manager.id){
                console.log("adding employees to inner department " + z);
                this.nodes[0].childs[index].childs[testRowIndex].childs.push({
                  name: data.departments[index].children[z].employees[f].full_name,
                  cssClass: 'ngx-org-ceo',
                  email: data.departments[index].children[z].employees[f].user.email,
                  mobile: data.departments[index].children[z].employees[f].user.mobile,
                  image: IMAGE_URL + "/employees/" + data.departments[index].children[z].employees[z].picture,
                  title: data.departments[index].children[z].employees[f].position != null ? data.departments[index].children[z].employees[f].position.name : '',
                  position: data.departments[index].children[z].employees[f].position != null ? data.departments[index].children[z].employees[f].position.name : '',
                  childs: [],
                });
              }
            }
        }
      }
      this.loading = false;
    }, err => {
    });
  }

  view(event){
    this.name = event.name;
    this.email = event.email;
    this.mobile = event.mobile;
    this.modal.open(this.modalContent, { size: 'sm' });
  }
}
