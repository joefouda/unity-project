import { Component, OnInit } from '@angular/core';
import { ApiService } from 'app/providers/api.service';

@Component({
  selector: 'ngx-policy-en',
  templateUrl: 'en.component.html',
  styleUrls: ['en.component.scss'],
})
export class ENComponent implements OnInit {
  constructor(private api: ApiService) {

  }
  
  ngOnInit() {
    this.api.protectedGet("getPolicyPage?lang=en",'').subscribe((data: any) => {
      let content = this.convertStringToHTML(data.body.policy_content)
      document.getElementById("en-policy-container").appendChild(content)
    });
  }

  convertStringToHTML = htmlString => {
    const parser = new DOMParser();
    const html = parser.parseFromString(htmlString, 'text/html');

    return html.body;
 }

}

