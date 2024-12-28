import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UiElementService} from "../../../services/ui-element.service";
import {UiElement} from "../../../model/ui-element";
import {UiElementFull} from "../../../model/ui-element-full";
import {DescriptorSet} from "../../../model/descriptor-set";
import {DescriptorSetService} from "../../../services/descriptor-set.service";
import {AuthService} from "../../../services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ui-element-edit',
  templateUrl: './ui-element-edit.component.html',
  styleUrls: ['./ui-element-edit.component.scss']
})
export class UiElementEditComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private router: Router,
              public uiElementService: UiElementService,
              private descriptorSetService: DescriptorSetService,
              public authService: AuthService) {
  }

  key: number | undefined;
  uiElement!: UiElementFull;
  _inProgress: boolean = false;
  _message: string = "";
  _showAfterUpdatedMessage: boolean = false;
  _showDelete: boolean = false;

  getUiShortElementByKey$!: Subscription;
  updateValueDescriptorsWrappedInDescriptorSet$!: Subscription;
  deleteUiShortElement$!: Subscription;
  params$!: Subscription;

  ngOnDestroy() {
    if (this.getUiShortElementByKey$) this.getUiShortElementByKey$.unsubscribe();
    if (this.updateValueDescriptorsWrappedInDescriptorSet$) this.updateValueDescriptorsWrappedInDescriptorSet$.unsubscribe();
    if (this.deleteUiShortElement$) this.deleteUiShortElement$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
  }

  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      this.key = params['key'];
      if (this.key != undefined) this.loadUiElementByKey(this.key);
    });
  }

  loadUiElementByKey(key: number) {
    this.getUiShortElementByKey$ = this.uiElementService.getUiShortElementByKey(key).subscribe({
      next: value => {
        if (value != null) {
          this.uiElement = structuredClone(value);
        } else {
          this.router.navigateByUrl("/ui-elements").then(r => console.log("Routing"));
        }
      }
    })
  }

  unDoData () {
    this._message = "";
    if (this.key != undefined) this.loadUiElementByKey(this.key);
  }
  updateDescriptors() {
    this._inProgress = true;
    const descriptorSetToUpdate: DescriptorSet = {
      descriptorSetId: 0,
      descriptors: []
    };
    for (let descriptor of this.uiElement.descriptors) {
      descriptorSetToUpdate.descriptors.push(descriptor);
    }
    this.updateValueDescriptorsWrappedInDescriptorSet$ = this.descriptorSetService.updateValueDescriptorsWrappedInDescriptorSet(descriptorSetToUpdate).subscribe({
      next: value => {
        this._inProgress = false;
        this._showAfterUpdatedMessage = true;
      }
    })
  }

  returnToViewMode() {
    this.router.navigateByUrl("/ui-elements").then(r => console.log("Routing"));
  }

  deleteUiElement() {
    //console.log("ID " + this.uiElement.uiElementId);
    this.deleteUiShortElement$ = this.uiElementService.deleteUiShortElement(this.uiElement.uiElementId).subscribe({
      next: value => {
        //@ToDo RELOAD LANGUAGE UI ELEMENTS BUFFER!!!
        this.returnToViewMode();
      }
    })
  }

}
