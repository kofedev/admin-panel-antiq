import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Staff} from "../model/staff.model";
import {Observable, Subject} from "rxjs";
import {Language} from "../model/language.model";
import {Image} from "../model/image";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {
  }

  public languagesAreModified$ = new Subject<number>();

  public saveNewLanguageAndExpand(language: Language): Observable<Language> {
    return this.http.post<Language>(this.environment.baseUrl + "/language", language);
  }

  public getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.environment.baseUrl + "/language");
  }

  public getLanguageById(languageId: number): Observable<Language> {
    return this.http.get<Language>(this.environment.baseUrl + "/language/" + languageId);
  }

  public getInitialLanguage(): Observable<Language> {
    return this.http.get<Language>(this.environment.baseUrl + "/language/initial");
  }

  public updateLanguage(language: Language, languageId: number): Observable<Language> {
    return this.http.put<Language>(this.environment.baseUrl + "/language/" + languageId, language);
  }

  public setDefaultLanguage(language: Language, languageId: number): Observable<Language> {
    return this.http.put<Language>(this.environment.baseUrl + "/language/default/" + languageId, language);
  }

  public deleteLanguage(languageId: number): Observable<Language> {
    return this.http.delete<Language>(this.environment.baseUrl + "/language/" + languageId);
  }

  public exportUiElementsByLanguageToExcel(languageId: number): Observable<Blob> {
    const options = { responseType: 'blob' as 'json' };
    return this.http.get<Blob>(this.environment.baseUrl + "/language/export/excel/" + languageId, options);
  }

  public importUiElementsForLanguageFromExcel(file: File): Observable<any> {
      let formParams = new FormData();
      formParams.append('file', file);
    return this.http.post<any>(this.environment.baseUrl + "/language/import", formParams);
  }

}
