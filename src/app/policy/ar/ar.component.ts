import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/providers/api.service';

@Component({
  selector: 'ngx-policy-ar',
  templateUrl: 'ar.component.html',
  styleUrls: ['ar.component.scss'],
})
export class ARComponent implements OnInit {
  constructor(private api: ApiService) {

  }
  content
  ngOnInit() {

    this.api.protectedGet("getPolicyPage?lang=ar",'').subscribe((data: any) => {
      let contentContainer = document.getElementById("ar-policy-container")
      contentContainer.innerHTML = data.body.policy_content
    });
  }
}

