import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LanguageService} from "../../../services/language.service";
import {Language} from "../../../model/language.model";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-language-new',
  templateUrl: './language-new.component.html',
  styleUrls: ['./language-new.component.scss']
})
export class LanguageNewComponent implements OnDestroy {

  constructor(private router: Router,
              private languageService: LanguageService,
              public uiElementService: UiElementService) {}

  saveNewLanguageAndExpand$!: Subscription;

  ngOnDestroy() {
    if (this.saveNewLanguageAndExpand$) this.saveNewLanguageAndExpand$.unsubscribe();
  }

  newLanguage: Language = {
    languageId: 0,
    languageCode: "",
    languageName: "",
    isActive: true,
    byDefault: false,
    isInitial: false
  }

  _inProgress: boolean = false;
  _message: string = "";
  _askToConfirm: boolean = false;

  returnToViewMode() {
    this.router.navigateByUrl("/language").then(r => console.log("Routing"));
  }

  saveNewLanguage() {
    if (this.newLanguage.languageCode.trim().length == 0) return;
    this._inProgress = true;
    this.saveNewLanguageAndExpand$ = this.languageService.saveNewLanguageAndExpand(this.newLanguage).subscribe({
      next: value => {
        this._inProgress = false;
        this.languageService.languagesAreModified$.next(Math.random());
        this.returnToViewMode();
      }
    })
  }

  unDoData() {
    this.newLanguage = {
      languageId: 0,
      languageCode: "",
      languageName: "",
      isActive: true,
      byDefault: false,
      isInitial: false
    }
  }


}


