import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiElementService} from "../../services/ui-element.service";
import {UiElement} from "../../model/ui-element";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ui-element',
  templateUrl: './ui-element.component.html',
  styleUrls: ['./ui-element.component.scss']
})
export class UiElementComponent implements OnInit, OnDestroy {

  constructor(public uiElementService: UiElementService,
              private router: Router,
              public authService: AuthService) { }

  registerNewUiShortElementAndExpand$!: Subscription;
  getAllUiShortElementsForInitialLanguage$!: Subscription;

  ngOnDestroy() {
    if (this.registerNewUiShortElementAndExpand$) this.registerNewUiShortElementAndExpand$.unsubscribe();
    if (this.getAllUiShortElementsForInitialLanguage$) this.getAllUiShortElementsForInitialLanguage$.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUiElementsArray();
  }

  uiElements: UiElement[] = [];
  _inProgress: boolean = false;
  _newDefaultValue = "";
  _newIsBig = false;

  loadUiElementsArray() {
    // for initial language: because we want to see default values
    this.getAllUiShortElementsForInitialLanguage$ = this.uiElementService.getAllUiShortElementsForInitialLanguage().subscribe({
      next: value => {
        this.uiElements = structuredClone(value);
      }
    })
  }

  registerNewShortUiElement () {
    //if (this._newKey.trim().length == 0) return;
    this._inProgress = true;
    let request: UiElement = {
      isBig: this._newIsBig,
      key: 0,
      value: this._newDefaultValue
    }

    this.registerNewUiShortElementAndExpand$ = this.uiElementService.registerNewUiShortElementAndExpand(request).subscribe({
      next: value => {
        this.loadUiElementsArray();
        this._newDefaultValue = "";
        this._inProgress = false;
      }
    })
  }

  goToEditUiElement(uiElement: UiElement) {
    this.router.navigateByUrl("ui-elements/edit/" + uiElement.key).then(r => console.log("Routing"));
  }

  isUiElementHasMaximumKey(uiElement: UiElement) {
    const maxKey = Math.max(...this.uiElements.map(element => element.key), Number.MIN_SAFE_INTEGER);
    return uiElement.key === maxKey;
  }

}
