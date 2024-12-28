import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Language} from "../../../model/language.model";
import {LanguageService} from "../../../services/language.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-language-edit',
  templateUrl: './language-edit.component.html',
  styleUrls: ['./language-edit.component.scss']
})
export class LanguageEditComponent implements OnInit, OnDestroy {

  languageId: number | undefined;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private languageService: LanguageService,
              public uiElementService: UiElementService) {}

  getLanguageById$!: Subscription;
  updateLanguage$!: Subscription;
  deleteLanguage$!: Subscription;
  params$!: Subscription;

  ngOnDestroy() {
    if (this.getLanguageById$) this.getLanguageById$.unsubscribe();
    if (this.updateLanguage$) this.updateLanguage$.unsubscribe();
    if (this.deleteLanguage$) this.deleteLanguage$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
  }

  ngOnInit(): void {
    // Access the route parameter 'languageId'
    this.params$ = this.route.params.subscribe(params => {
      this.languageId = +params['languageId']; // '+' is used to convert string to number
      this.loadLanguage(this.languageId);
    });
  }

  _inProgress:boolean = false;
  _message: string = "";
  _language!: Language;

  _newCode: string = "";
  _newName: string = "";
  _newActiveStatus: boolean = true;
  _newByDefaultStatus: boolean = false;

  _askToConfirm: boolean = false;
  _deleteProcessAnswerUnlocked: boolean = false;
  _showAfterUpdatedMessage: boolean = false;

  loadLanguage(languageId: number) {
    this.getLanguageById$ = this.languageService.getLanguageById(languageId).subscribe({
      next: value => {
        // console.log("VALUE: " + value);
        if (value != null) {
          this._language = structuredClone(value);
          this._newCode = value.languageCode;
          this._newName = value.languageName;
          this._newActiveStatus = value.isActive;
          this._newByDefaultStatus = value.byDefault;
        } else {
          this.router.navigateByUrl("/language").then(r => console.log("Routing"));
        }
      }
    })
  }
  returnToViewMode() {
    this.router.navigateByUrl("/language").then(r => console.log("Routing"));
  }

  updateLanguage() {
    if (this._newCode.trim().length == 0) return;
    if (this._newCode.trim() == this._language.languageCode.trim() &&
        this._newName.trim() == this._language.languageName.trim() &&
        this._newActiveStatus == this._language.isActive) return;
    this._inProgress = true;
    let languageToSend: Language = {
      languageId: this._language.languageId,
      languageCode: this._newCode,
      languageName: this._newName,
      byDefault: this._newByDefaultStatus,
      isActive: this._newActiveStatus
    }
    this.updateLanguage$ = this.languageService.updateLanguage(languageToSend, this._language.languageId).subscribe({
      next: value => {
        this._language = structuredClone(value);
        this._newCode = value.languageCode;
        this._newName = value.languageName;
        this._newActiveStatus = value.isActive;
        this._newByDefaultStatus = value.byDefault;
        this._inProgress = false;
        this._showAfterUpdatedMessage = true;
        this.languageService.languagesAreModified$.next(Math.random());
      }
    })
  }

  unDoData() {
    this._newCode = this._language.languageCode;
    this._newName = this._language.languageName;
    this._newActiveStatus = this._language.isActive;
    this._newByDefaultStatus = this._language.byDefault;
  }

  deleteLanguage() {
    if (this._language.isInitial) return;
    this._message = "";
    this._askToConfirm = true;
  }

  deleteLanguageProcess() {
    if (this._language.isInitial) return;
    this._inProgress = true;
    this._deleteProcessAnswerUnlocked = false;
    this._askToConfirm = false;
    this.deleteLanguage$ = this.languageService.deleteLanguage(this._language.languageId).subscribe({
      next: value => {
        this._inProgress = false;
        this.languageService.languagesAreModified$.next(Math.random());
        this.returnToViewMode();
      }
    })
  }

}
