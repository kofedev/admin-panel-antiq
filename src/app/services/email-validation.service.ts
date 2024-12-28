import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import {EnvironmentService} from "./environment.service";

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {
  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public isEmailValidSimpleCheck(email: string): boolean {
    if (email.includes(' ')) {
      return false;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email.match(emailRegex)) {
      return false;
    }
    return true;
  }

  public emailDomainValidation(email: string): Observable<any> {
    let domain: string = email.split('@')[1];
    return this.http.get<any>(this.environment.baseUrl + "/validator/domain?domain=" + domain);
  }

}
