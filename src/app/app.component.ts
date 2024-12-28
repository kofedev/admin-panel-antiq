import {Component, OnInit} from '@angular/core';
import {EnvironmentService} from "./services/environment.service";
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {CurrentLanguageService} from "./services/current-language.service";
import {LanguageService} from "./services/language.service";
import {UiElementService} from "./services/ui-element.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ready = true;

  constructor(private environment: EnvironmentService,
              public currentLanguageService: CurrentLanguageService,
              public authService: AuthService,
              private router: Router,
              private languageService: LanguageService,
              public uiElementService: UiElementService) { }

  ngOnInit(): void {
    this.initSystem();
    this.languageService.languagesAreModified$.subscribe({
      next: value => { this.initLanguageSystem(); }
    })
  }

  initSystem () {
    this.ready = false;
    if (this.authService.autoLogin()) {
      console.log("Auto Login : OK");
      // stay here :)
    } else {
      console.log("Auto Login : NO");
      // going to the authentication page
      this.router.navigateByUrl("/auth").then(r => console.log("Routing"));
    }
    this.initLanguageSystem();
  }

  initLanguageSystem() {
    this.currentLanguageService.getAllActiveLanguages().subscribe({
      next: value => {
        this.currentLanguageService.activeLanguageArray = structuredClone(value);
        // *** set current language as a system default language
        const defaultLanguage = value.find(language => language.byDefault);
        if (defaultLanguage) {
          this.currentLanguageService.currentLanguage = defaultLanguage;
        } else { console.error("System current language not found"); }
        // *** attempt: set user's current language
        const user_defaultLanguageId: number | null = Number(localStorage.getItem(this.environment.localStorageKeyCurrentLanguage));
        if (user_defaultLanguageId) {
          const user_defaultLanguage = value.find(language => language.languageId === user_defaultLanguageId);
          if (user_defaultLanguage) { this.currentLanguageService.currentLanguage = user_defaultLanguage; }
        } else {
          localStorage.setItem(this.environment.localStorageKeyCurrentLanguage, String(this.currentLanguageService.currentLanguage.languageId));
        }
        // ***
        console.log("CURRENT LANGUAGE: " + this.currentLanguageService.currentLanguage.languageCode);

        // *** LOAD UI SHORTS ELEMENTS BY LANGUAGE AND LOAD LOCAL BUFFER
        this.uiElementService.getUiShortElementsByLanguage_Ultra(this.currentLanguageService.currentLanguage.languageId).subscribe({
          next: value => {
            this.uiElementService.uiElements = value;
          }
        });

        // *** READY TO START
        this.ready = true;
      }
    })
  }

}
