import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EnvironmentService} from "./environment.service";
import {User} from "../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {
  }

  public checkIfEmailExist(email: string): Observable<boolean> {
    return this.http.get<boolean>(this.environment.baseUrl + "/users?email=" + email);
  }

  // public getAllUsers(): Observable<object> {
  //   return this.http.get<object>(this.environment.baseUrl + "/");
  // }

  public changePassword(user: User): Observable<User> {
    return this.http.put<User>(this.environment.baseUrl + "/user/pass", user);
  }

  public changeEmail(user: User): Observable<User> {
    return this.http.put<User>(this.environment.baseUrl + "/user/email", user);
  }

  public passwordRestore(email: string): Observable<any> {
    console.log("PROCESS IS HERE WITH THE " + email);
    return this.http.get<any>(this.environment.baseUrl + "/issue/restore?email=" + email);
  }

  public changeSingleRoleUser(user: User): Observable<User> {
    return this.http.put<User>(this.environment.baseUrl + "/role", user);
  }

  public validatePassword(password: string): boolean {
    // console.log("CHECK PASSWORD: " + password); ////////
    if (password.length <= 4) {
      //console.log("SHORT");
      return false;
    }

    // if (/^\s*$/.test(password)) {
    //   console.log("GAPS");
    //   return false;
    // }

    if (/\s/.test(password)) {
      console.log("GAPS");
      return false;
    }

    return true;
  }

}
