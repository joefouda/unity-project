import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'ngx-index-add',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.scss'],
})
export class AddComponent implements OnInit {
  public myForm: FormGroup;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  picture: File

  messages
  branch: any = {
    id: '',
    name: '',
    name_ar: '',
    latitude: null,
    longitude: null,
  };
  latitude: number;
  longitude: number;
  zoom:number;

  submitted = false;
  loading = false;
  token;
  public message: string;
  isEdit = false;
  address: string;
  private geoCoder;
  constructor(private toastrService: NbToastrService, private api: ApiService,
    private translate: TranslateService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone
    ) {

    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
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
      if (data.params.id != null) {
        this.isEdit = true;
        this.branch.id = data.params.id;
        this.loadItem();
      }
    });

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      const options = {
        // bounds: defaultBounds,
        componentRestrictions: { country: "sa" },
        fields: ["address_components", "geometry", "icon", "name"],
        // origin: center,
        strictBounds: false,
        types: ["establishment"],
      };

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

  }

  loadItem() {
    this.api.protectedGet('branches/' + this.branch.id, this.token).subscribe((data) => {
      this.branch = data;
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 15;
      });
    }
  }

  save() {
    this.loading = true;
    if (!this.myForm.valid) {
      this.loading = false;
      this.submitted = true;
      return;
    }
    this.branch.latitude = this.latitude;
    this.branch.longitude = this.longitude;
    this.api.protectedPost('branches', this.branch, this.token).subscribe((data: any) => {
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

  markerDragEnd($event:any) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  showSuccessMsgAndReturn(){
    this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    this.loading = false;
    this.router.navigate(['/pages/branches']);
  }
}
