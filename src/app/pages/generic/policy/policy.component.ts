import { Component, OnInit } from '@angular/core';
import { NbToastrService, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../providers/api.service'
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from 'app/models/page';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import * as goSell from '../../../../gosell.js';
import { ActivatedRoute } from '@angular/router';
import { DASHBOARD_LINK } from '../../../providers/providers'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import AREditor from '@ckeditor/ckeditor5-build-classic/build/translations/ar.js';


@Component({
  selector: 'ngx-policy',
  templateUrl: 'policy.component.html',
  styleUrls: ['policy.component.scss'],
})
export class PolicyComponent implements OnInit {

  exportAsConfig: ExportAsConfig = {
    type: 'xlsx', 
    elementIdOrContent: 'myTableElementId', 
  }
  en_content = ''
  ar_content = '';
  en_editor = ClassicEditor;
  ar_editor = ClassicEditor;
  en_data = ""
  ar_data = ""

  token;
  admin = false;
  title;
  activeText = "Active";
  inActiveText = "Inactive";
  loadingIndicator = true;
  data;
  page = new Page();
  columns = [];
  messages;
  ColumnMode = ColumnMode;
  temp = [];
  loading = true;
  date: any;
  backendPage = 0;

  query = {
    name: '',
    mobile: '',
    is_active: '',
  }
  q = "";
  allData = [];
  exported = false;
  peopleLoading = false;
  companyIds = [];
  range;
  rangeQ = {
    start: '',
    end: '',
  }
  bill;
  user;
  roleId;
  lang;
  dashboardLink = DASHBOARD_LINK;
  constructor(
    private toastrService: NbToastrService,
    private translate: TranslateService, 
    private api: ApiService,
    private exportAsService: ExportAsService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute
    ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.roleId = localStorage.getItem('roleId');
    this.admin =  this.roleId == '1' ? true : false;
    this.api.protectedGet("getPolicy", this.token).subscribe((data: any) => {
      this.en_content = data.body.policy.policy_en
      this.ar_content = data.body.policy.policy_ar
    });
    // this.getResult({ offset: 0 });
    this.translate.get('TOAST_MESSAGES')
    .subscribe((data) => {
      this.messages = data;
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    });
    // this.route.queryParams.subscribe((data: any) => {
    //   console.log(data);
    //   if(data.tap_id != null){
    //     window.addEventListener("beforeunload", function (e) {
    //       var confirmationMessage = "\o/";
    //       console.log("cond");
    //       e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
    //       return confirmationMessage;              // Gecko, WebKit, Chrome <34
    //   });
    //     setTimeout(() => {
    //       this.data.find(x => x.id == data.bill_id).is_paid = true;
    //     }, 1000);
    //     this.api.protectedGet("confirm-pay?tap_id=" + data.tap_id + "&bill_id=" + data.bill_id, this.token).subscribe((data: any) => {
    //       if(data){
    //         this.toastrService.success(this.messages.SUCCESS_INFO, this.messages.SUCCESS, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //         this.data.find(x => x.id == data.bill_id).is_paid = true;
    //       } else {
    //         this.toastrService.danger(this.messages.ERROR_INFO, this.messages.ERROR, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
    //       }
    //     });
    //   }

      
//       bill_id: "1"
// mode: "popup"
// tap_id: "chg_TS013720211434m5RT0908393"
// token: "6111101904833fb80aad11db"


//       bill_id: "1"
// mode: "popup"
// tap_id: "chg_TS015220211338b5DR0908306"
// token: "6111030475066fbd5e2ce6b0"


  //     goSell.showResult({
  //       callback: response => {
  //         console.log("callback");
  //         console.log(response);
  //     }
  //   });
  // });
}

  
  // export() {
  //   this.api.protectedGet("billing-all", this.token).subscribe((data: any) => {
  //     this.allData = data;
  //     this.exported = true;
  //     setTimeout(() => {
  //       this.exportAsService.save(this.exportAsConfig, 'billing sheets').subscribe(() => {
  //       });
  //     }, 100);
  //   });
  // }

  // getResult(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.backendPage = this.page.pageNumber + 1;
  //   this.api.protectedGet("billing?page=" + this.backendPage + this.q, this.token).subscribe((data: any) => {
  //     this.data = data.data;
  //     this.page.totalElements = data.total;
  //     this.loadingIndicator = false;
  //   });
  // }

  submitContent() {
    console.log(this.ar_content)
    debugger
    this.loadingIndicator = true;
    this.api.protectedPost("updatePolicy", {policy_ar:this.ar_content || '', policy_en:this.en_content || ''}, this.token).subscribe((data: any) => {
      this.toastrService.success(this.messages.SUCCESS_INFO, data.msg, { position: NbGlobalPhysicalPosition.BOTTOM_LEFT });
      console.log(data)
    });
  }

  // search(){
  //   if(this.range != null){
  //     this.rangeQ.start = new Date(this.range.start).toISOString().slice(0, 10)
  //     this.rangeQ.end = new Date(this.range.end).toISOString().slice(0, 10)
  //   }
  //   this.getSearchResult({ offset: 0 });
  // }

  // getSearchResult(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.backendPage = this.page.pageNumber + 1;
  //   this.api.protectedGet("billing?page=" + this.backendPage + 
  //   "&from=" + this.rangeQ.start + "&to=" + this.rangeQ.end + 
  //   "&company_ids=" + this.companyIds.toString(), this.token).subscribe((data: any) => {
  //     this.data = data.data;
  //     this.page.totalElements = data.total;
  //     this.loadingIndicator = false;
  //   });
  // }

  // pay(dialog, bill){
  //   this.bill = bill;
  //   this.bill.vat = (this.bill.amount * 0.15);
  //   this.bill.total = (this.bill.amount + this.bill.vat);

  //   this.dialogService.open(dialog);
  // }

  // payNow(){
  //   goSell.config({
  //     containerID: "root",
  //     gateway: {
  //       publicKey: "pk_test_JQjiwcVAagUFOdHC8P3rIM5q",
  //       merchantId: null,
  //       language: "en",
  //       contactInfo: true,
  //       supportedCurrencies: "all",
  //       supportedPaymentMethods: "all",
  //       saveCardOption: false,
  //       customerCards: true,
  //       notifications: "standard",
  //       callback: (response) => {
  //         console.log("response", response);
  //       },
  //       onClose: () => {
  //         console.log("onClose Event");
  //       },
  //       backgroundImg: {
  //         url: "imgURL",
  //         opacity: "0.5",
  //       },
  //       labels: {
  //         cardNumber: "Card Number",
  //         expirationDate: "MM/YY",
  //         cvv: "CVV",
  //         cardHolder: "Name on Card",
  //         actionButton: "Pay",
  //       },
  //       style: {
  //         base: {
  //           color: "#535353",
  //           lineHeight: "18px",
  //           fontFamily: "sans-serif",
  //           fontSmoothing: "antialiased",
  //           fontSize: "16px",
  //           "::placeholder": {
  //             color: "rgba(0, 0, 0, 0.26)",
  //             fontSize: "15px",
  //           },
  //         },
  //         invalid: {
  //           color: "red",
  //           iconColor: "#fa755a ",
  //         },
  //       },
  //     },
  //     customer: {
  //       id: null,
  //       first_name: this.user.name,
  //       middle_name: "",
  //       last_name: "",
  //       email: this.user.email,
  //       phone: {
  //         country_code: "966",
  //         number: this.user.mobile,
  //       },
  //     },
  //     order: {
  //       amount: this.bill.total,
  //       currency: "SAR",
  //       items: [
  //         {
  //           id: 1,
  //           name: "Services",
  //           description: "Usage service",
  //           quantity: "1",
  //           amount_per_unit: this.bill.total,
  //           total_amount: this.bill.total,
  //         },
  //       ],
  //       shipping: null,
  //       taxes: null,
  //     },
  //     transaction: {
  //       mode: "charge",
  //       charge: {
  //         saveCard: false,
  //         threeDSecure: true,
  //         description: "Test Description",
  //         statement_descriptor: "Sample",
  //         reference: {
  //           transaction: "txn_0001",
  //           order: "ord_0001",
  //         },
  //         hashstring:"",
  //         metadata: {},
  //         receipt: {
  //           email: false,
  //           sms: true,
  //         },
  //         redirect: this.dashboardLink + "pages/g/billing?bill_id=" + this.bill.id,
  //         post: null,
  //       },
  //     },
  //   });
  //   goSell.openLightBox();
  // }
}