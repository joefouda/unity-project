import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINT, DOMAIN_NAME } from './providers';
import { BehaviorSubject, Subject } from "rxjs";
import 'rxjs/add/operator/map';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: string = API_ENDPOINT;
  domain: string = DOMAIN_NAME;
  constructor(public http: HttpClient) {
  }

  protectedGet(endpoint: string, token: any, params?: any,){
    return this.http.get(this.url + endpoint, {
      headers: new HttpHeaders().set('Authorization', "Bearer " +token),
    });
  }
  protectedPost(endpoint: string, body: any, token: any){
    return this.http.post(this.url + endpoint, body, {
      headers: new HttpHeaders().set('Authorization', "Bearer " +token),
    });
  }

  protectedPatch(endpoint: string, body: any, token: any){
    return this.http.patch(this.url + endpoint, body, {
      headers: new HttpHeaders().set('Authorization', "Bearer " +token),
    });
  }

  protectedPut(endpoint: string, body: any, token: any){
    return this.http.put(this.url + endpoint, body, {
        headers: new HttpHeaders().set('Authorization', "Bearer " +token),
    });
  }

  protectedDelete(endpoint: string, token: any, params?: any,){
    return this.http.delete(this.url + endpoint, {
      headers: new HttpHeaders().set('Authorization', "Bearer " +token),
    });
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    return this.http.get(this.url + endpoint);
  }

  getPublic(endpoint: string) {
    return this.http.get(this.domain + endpoint, {responseType: 'text'});
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + endpoint, body, reqOpts);
  }
}
