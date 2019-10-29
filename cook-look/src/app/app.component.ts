import { Component } from '@angular/core';
import { RecipeService } from './services/recipe.service';
import { DataBaseService } from './services/data-base.service';
import { AlertsService } from '@jaspero/ng2-alerts';
import { AlertType } from '@jaspero/ng-alerts';
import { document } from 'angular-bootstrap-md/utils/facade/browser';
import { Router } from '@angular/router';
import { SpeechSupportService, RecognitionResult } from './modules/speech-support/speech-support.service';
import { HostListener } from '@angular/core';

import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { templateJitUrl } from '@angular/compiler';
// import { ToastService } from '../../typescripts/pro/alerts'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private targetElementName: string;

  public readonly reasonFieldName = 'reason';
  public readonly amountFieldName = 'amount';
  public readonly selectedLanguageFieldName = 'selectedLanguage';
  public showspeech: boolean = false;

  public expenseForm: FormGroup

  public get Reason(): AbstractControl {
    return this.expenseForm.get(this.reasonFieldName);
  }

  public get Amount(): AbstractControl {
    return this.expenseForm.get(this.amountFieldName);
  }

  public get SelectedLanguage(): AbstractControl{
    return this.expenseForm.get(this.selectedLanguageFieldName);
  }

  public get ListeningReason(): boolean {
    return this.speech.IsListening && this.targetElementName === this.reasonFieldName;
  }

  public get ListeningAmount(): boolean {
    return this.speech.IsListening && this.targetElementName === this.amountFieldName;
  }


  public ngOnInit(): void {
    this.expenseForm = this.fb.group({
      reason: [null, [Validators.required, Validators.maxLength(200)]],
      amount: [null, [Validators.required, Validators.min(0)]],
      selectedLanguage:['en-US']
    });

    this.speech.Result.subscribe((result: RecognitionResult) => {
      console.log('Result event on the controller.');
      console.log(result);
      window.document.getElementById(this.targetElementName).focus();
      if(!result){
        this.targetElementName=null;
        return;
      }
      if (this.targetElementName === this.reasonFieldName) {
        this.Reason.setValue(result.transcript);
      } else if (this.targetElementName === this.amountFieldName) {
        this.Amount.setValue(result.transcript);
      }
      
      this.targetElementName = null;
    });
  }

  public toggleListening(fieldSelected: string): void {
    this.targetElementName = fieldSelected;

    if (this.speech.IsListening) {
      this.speech.stopListening();
    } else {
      this.speech.requestListening(this.SelectedLanguage.value);
    }
  }

  public clearCard(): void {
    const languageValueBefore=this.SelectedLanguage.value;
    this.expenseForm.reset();
    this.SelectedLanguage.setValue(languageValueBefore);
  }

  public saveExpense(): void {
    var rawData = this.expenseForm.getRawValue();

    // send the data to you backend service and handle the answer.
    console.log(rawData);
  }

  callSpeech(){
    //this.showspeech=true;
    this.toggleListening("reasonFieldName");
    
  }
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(event.key=='Enter'){this.toggleListening("reasonFieldName");}
  }

  options = {
    overlay: false,
    overlayClickToClose: true,
    showCloseButton: false,
    duration: 3000
  };
  oldid = '';
  newid = '';
  urlProfilImg = 'assets\\homeImg\\logo1.png';
  modeClass;
  modeDisplay;
 // dbs;
  constructor(private _recipeService: RecipeService,
  public dbs: DataBaseService,
    private _alert: AlertsService,
    private router: Router, private fb: FormBuilder, public speech: SpeechSupportService) {
setInterval(() => {this.chackImails(); }
                       , 400000);

// this.dbs = dbs;


  }


  createAlert(type, message, tytle) {
    if (tytle === '') {
      this._alert.create(type, message);
    } else {
      this._alert.create(type, message, tytle);
    }
  }

  apears(user) {
    return (this.dbs.userNameList.indexOf(user) > 0);
  }
  signUp() {
    this.dbs.user = this.newid;
    this.dbs.changeUser();
    this.dbs.counterRef.doc('counterRecipe').set({ counter: 0 });
    this.dbs.counterRef.doc('counterIngredients').set({ counter: 0 });
    this.dbs.counterRef.doc('counterInstructions').set({ counter: 0 });
    this.dbs.allUsersRef.doc(this.newid).set({ userName: this.newid, password: 1234 });
    this.setProfile();
    this.createAlert('success', 'You Signed In Successfully!', '');
    this.router.navigate(['/']);
    this.newid = '';

  }

  login() {
    this.dbs.user = this.oldid;
    this.dbs.changeUser();
    this.createAlert('success', 'You Loged In Successfully!', '');
    this.router.navigate(['/']);
    this.oldid = '';
  }
  logout() {
    this.dbs.user = 'demoUser';
    this.createAlert('success', 'You Loged Out Successfully!', '');
    this.router.navigate(['/']);
    this.dbs.changeUser();
    this.chackImails();
  }
  isLogin() {
    return this.dbs.user !== 'demoUser';
  }
  chackImails() {
    if (this.dbs.mailsForUser && this.dbs.user !== 'demoUser') {
      this.createAlert('info', 'There are recipes was shared with you!', '');
    } else if (this.dbs.user === 'demoUser' && !this.dbs.mailsForUser) {
      this.createAlert('warning', 'You are not loged in!!!', '');
    } else if (this.dbs.user === 'demoUser' && this.dbs.mailsForUser) {

    }
  }
  setProfile() {
    this.dbs.updateProfileImg();
  }

  
}






/* @Component({
  selector: 'app-expenses-form',
  templateUrl: './expenses-form.component.html',
  styleUrls: ['./expenses-form.component.css']
})
export class ExpensesFormComponent /* implements OnInit */  
