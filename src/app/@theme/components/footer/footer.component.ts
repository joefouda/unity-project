import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by <b><a href="https://faisal49m/" target="_blank">Ray Team</a></b> 2022
    </span>
    <div class="socials">
      <a href="https://twitter.com/HcmUnisync" target="_blank" class="ion ion-social-twitter"></a>
      <a href="https://linkedin.com/ray" target="_blank" class="ion ion-social-linkedin"></a>

    </div>
  `,
})
export class FooterComponent {
}
