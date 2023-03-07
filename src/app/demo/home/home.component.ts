import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-demo-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {

  }
  disabled :boolean

  ngOnInit() {
   this.disabled = localStorage.getItem('leave')?true:false
   console.log(this.disabled)
  }

}

