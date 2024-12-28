import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {UiElementFull} from "../model/ui-element-full";
import {UiElement} from "../model/ui-element";

@Injectable({
  providedIn: 'root'
})
export class UiBigElementService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public getUiBigElementByKey(key: number): Observable<UiElementFull> {
    return this.http.get<UiElementFull>(this.environment.baseUrl + "/uibig/key/" + key);
  }

  public getAllUiBigElementsForInitialLanguage(): Observable<UiElement[]> {
    return this.http.get<UiElement[]>(this.environment.baseUrl + "/uibig/initial");
  }

  public registerNewUiBigElementAndExpand(request: UiElement): Observable<any> {
    return this.http.post<any>(this.environment.baseUrl + "/uibig", request);
  }

  public deleteUiBigElement(uiElementId: number): Observable<any> {
    return this.http.delete<any>(this.environment.baseUrl + "/uibig/" + uiElementId);
  }


}
