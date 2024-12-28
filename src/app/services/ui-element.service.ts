import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Staff} from "../model/staff.model";
import {UiElement} from "../model/ui-element";
import {UiElementFull} from "../model/ui-element-full";
import {Language} from "../model/language.model";

@Injectable({
  providedIn: 'root'
})
export class UiElementService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  uiElements: string[] = [];

  public getUiShortElementsByLanguage_Ultra(languageId: number): Observable<string[]> {
    return this.http.get<string[]>(this.environment.baseUrl + "/uishort/common/" + languageId);
  }

  public registerNewUiShortElementAndExpand(request: UiElement): Observable<any> {
    return this.http.post<any>(this.environment.baseUrl + "/uishort", request);
  }

  public getAllUiShortElementsForInitialLanguage(): Observable<UiElement[]> {
    return this.http.get<UiElement[]>(this.environment.baseUrl + "/uishort/initial");
  }

  public getUiShortElementByKey(key: number): Observable<UiElementFull> {
    return this.http.get<UiElementFull>(this.environment.baseUrl + "/uishort/key/" + key);
  }

  public deleteUiShortElement(uiElementId: number): Observable<any> {
    return this.http.delete<any>(this.environment.baseUrl + "/uishort/" + uiElementId);
  }

  public getUiShortsElementsByLanguageId(languageId: number): Observable<UiElement[]> {
    return this.http.get<UiElement[]>(this.environment.baseUrl + "/uishort/common/" + languageId);
  }


}
