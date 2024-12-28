import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Descriptor} from "../../../model/descriptor";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-descriptor-editor',
  templateUrl: './descriptor-editor.component.html',
  styleUrls: ['./descriptor-editor.component.scss']
})
export class DescriptorEditorComponent  {

  @Input() descriptor: Descriptor | undefined;

  constructor(public uiElementService: UiElementService) { }

}
