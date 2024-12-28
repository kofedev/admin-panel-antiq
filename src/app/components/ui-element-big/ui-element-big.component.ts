import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UiElement} from "../../model/ui-element";
import {UiBigElementService} from "../../services/ui-big-element.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-ui-element-big',
  templateUrl: './ui-element-big.component.html',
  styleUrls: ['./ui-element-big.component.scss']
})
export class UiElementBigComponent implements OnInit, OnDestroy {

  constructor(private uiBigElementService: UiBigElementService,
              private router: Router,
              public authService: AuthService,
              public uiElementService: UiElementService) { }

  uiBigElements: UiElement[] = [];
  _inProgress: boolean = false;
  _newDefaultValue = "";

  getAllUiBigElementsForInitialLanguage$!: Subscription;
  registerNewUiBigElementAndExpand$!: Subscription;

  ngOnDestroy() {
    if (this.getAllUiBigElementsForInitialLanguage$) this.getAllUiBigElementsForInitialLanguage$.unsubscribe();
    if (this.registerNewUiBigElementAndExpand$) this.registerNewUiBigElementAndExpand$.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUiBigElementsArray();
  }

  loadUiBigElementsArray() {
    // for initial language: because we want to see default values
    this.getAllUiBigElementsForInitialLanguage$ = this.uiBigElementService.getAllUiBigElementsForInitialLanguage().subscribe({
      next: value => {
        this.uiBigElements = structuredClone(value);
      }
    })
  }

  registerNewBigUiElement() {
    this._inProgress = true;
    let request: UiElement = {
      isBig: true,
      key: 0,
      value: this._newDefaultValue
    }
    this.registerNewUiBigElementAndExpand$ = this.uiBigElementService.registerNewUiBigElementAndExpand(request).subscribe({
      next: value => {
        this.loadUiBigElementsArray();
        this._newDefaultValue = "";
        this._inProgress = false;
      }
    })
  }

  goToEditUiBigElement (uiBigElement: UiElement) {
    this.router.navigateByUrl("ui-elements-big/edit/" + uiBigElement.key).then(r => console.log("Routing"));
  }

  isUiElementHasMaximumKey (uiBigElement: UiElement): boolean {
    const maxKey = Math.max(...this.uiBigElements.map(element => element.key), Number.MIN_SAFE_INTEGER);
    return uiBigElement.key === maxKey;
  }

}

