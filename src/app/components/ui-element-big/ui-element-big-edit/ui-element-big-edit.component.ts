import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DescriptorSetService} from "../../../services/descriptor-set.service";
import {AuthService} from "../../../services/auth.service";
import {UiElementFull} from "../../../model/ui-element-full";
import {DescriptorSet} from "../../../model/descriptor-set";
import {UiBigElementService} from "../../../services/ui-big-element.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-ui-element-big-edit',
  templateUrl: './ui-element-big-edit.component.html',
  styleUrls: ['./ui-element-big-edit.component.scss']
})
export class UiElementBigEditComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uiBigElementService: UiBigElementService,
              private descriptorSetService: DescriptorSetService,
              public authService: AuthService,
              public uiElementService: UiElementService) {
  }

  key: number | undefined;
  uiElement!: UiElementFull;
  _inProgress: boolean = false;
  _message: string = "";
  _showAfterUpdatedMessage: boolean = false;

  deleteUiBigElement$!: Subscription;
  updateValueDescriptorsWrappedInDescriptorSet$!: Subscription;
  getUiBigElementByKey$!: Subscription;
  params$!: Subscription;

  ngOnDestroy() {
    if (this.deleteUiBigElement$) this.deleteUiBigElement$.unsubscribe();
    if (this.updateValueDescriptorsWrappedInDescriptorSet$) this.updateValueDescriptorsWrappedInDescriptorSet$.unsubscribe();
    if (this.getUiBigElementByKey$) this.getUiBigElementByKey$.unsubscribe();
    if (this.params$) this.params$.unsubscribe();
  }

  ngOnInit(): void {
    this.params$ = this.route.params.subscribe(params => {
      this.key = params['key'];
      if (this.key != undefined) this.loadUiBigElementByKey(this.key);
    });
  }

  loadUiBigElementByKey(key: number) {
    this.getUiBigElementByKey$ = this.uiBigElementService.getUiBigElementByKey(key).subscribe({
      next: value => {
        if (value != null) {
          this.uiElement = structuredClone(value);
        } else {
          this.router.navigateByUrl("/ui-elements-big").then(r => console.log("Routing"));
        }
      }
    })
  }

  unDoData () {
    this._message = "";
    if (this.key != undefined) this.loadUiBigElementByKey(this.key);
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
    this.router.navigateByUrl("/ui-elements-big").then(r => console.log("Routing"));
  }

  deleteUiElement() {
    //console.log("ID " + this.uiElement.uiElementId);
    this.deleteUiBigElement$ = this.uiBigElementService.deleteUiBigElement(this.uiElement.uiElementId).subscribe({
      next: value => {
        //@ToDo RELOAD LANGUAGE UI ELEMENTS BUFFER!!!
        this.returnToViewMode();
      }
    })
  }


}
