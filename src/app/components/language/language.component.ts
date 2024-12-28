import {Component, OnDestroy, OnInit} from '@angular/core';
import {LanguageService} from "../../services/language.service";
import {Language} from "../../model/language.model";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit, OnDestroy {

  constructor(private languageService: LanguageService,
              private router: Router,
              public uiElementService: UiElementService) {
  }

  languages: Language[] = [];
  getAllLanguages$!: Subscription;
  setDefaultLanguage$!: Subscription;

  ngOnDestroy() {
    if (this.getAllLanguages$) this.getAllLanguages$.unsubscribe();
    if (this.setDefaultLanguage$) this.setDefaultLanguage$.unsubscribe();
  }

  ngOnInit(): void {
    this.loadLanguageArray();
  }

  loadLanguageArray() {
    this.getAllLanguages$ = this.languageService.getAllLanguages().subscribe({
      next: value => {
        this.languages = structuredClone(value);
        this.languages.sort((a, b) => a.languageId - b.languageId);
      }
    })
  }

  goToEditLanguage(languageId: number) {
    this.router.navigateByUrl("/language/edit/" + languageId).then(r => console.log("Routing"));
  }
  goToRegisterNewLanguage() {
    this.router.navigateByUrl("/language/new").then(r => console.log("Routing"));
  }

  setDefaultLanguage(language: Language) {
    if (language.byDefault) return;
    if (!language.isActive) return;
    this.setDefaultLanguage$ = this.languageService.setDefaultLanguage(language, language.languageId).subscribe({
      next: value => {
        this.loadLanguageArray();
      }
    })

  }

}
