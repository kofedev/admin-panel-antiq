import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest, LoginResponse} from "../model/login.model";
import {BehaviorSubject, Observable} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {LoggedUser} from "../model/logged-user.model";
import {Router} from "@angular/router";
import {Staff} from "../model/staff.model";
import {EnvironmentService} from "./environment.service";
import {StaffService} from "./staff.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelperService = new JwtHelperService();
  user = new BehaviorSubject<LoggedUser | null>(null);
  tokenExpirationTimer: any;
  constructor(private environment: EnvironmentService,
              private http: HttpClient,
              private router: Router,
              private staffService: StaffService) { }

  public login(user: LoginRequest): Observable<LoginResponse> {

    // console.log("username: " + user.username);
    // console.log("password: " + user.password);

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('password', user.password);
    return this.http.post<LoginResponse>(this.environment.baseUrl + "/login", formData);
  }

  saveToken(jwtTokens: LoginResponse) {
    const decodedAccessToken = this.jwtHelperService.decodeToken(jwtTokens.accessToken);
    const loggedUser = new LoggedUser(decodedAccessToken.sub, decodedAccessToken.roles, jwtTokens.accessToken, this.getExpirationDate(decodedAccessToken.exp), undefined);
    this.user.next(loggedUser);
    // console.log("User Next, token:: " + this.user.value?.token); ////////////////////////////
    this.autoLogout(this.getExpirationDate(decodedAccessToken.exp).valueOf() - new Date().valueOf());
    localStorage.setItem('userData', JSON.stringify(loggedUser));

    this.redirectLoggedInUser(decodedAccessToken, jwtTokens.accessToken);
  }

  redirectLoggedInUser(decodedToken: any, accessToken: string) {

    this.router.navigateByUrl("/");

  }

  public autoLogin() : boolean {

    const userData: {
      username: string,
      roles: string[],
      _token: string,
      _expiration: Date,
      staff: Staff | undefined
    } = JSON.parse(localStorage.getItem('userData')!);

    if (!userData)  {
      return false;
    } else {
      const loadedUser = new LoggedUser(userData.username, userData.roles, userData._token, new Date(userData._expiration), userData.staff);
      if (loadedUser.token) {
        this.user.next(loadedUser);
        this.autoLogout(loadedUser._expiration.valueOf() - new Date().valueOf()); //@ToDo ///// ??????????????????
      }
    }

    return true;
  }

  getExpirationDate(exp: number) {
    const date = new Date(0);
    date.setUTCSeconds(exp)
    return date;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      //@ToDo or going to REFRESH TOKEN
    }, expirationDuration)
  }

  logout() {
    localStorage.clear();
    this.user.next(null);
    this.router.navigate(['/auth'])
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }


  //@ToDo
  refreshStaff(staff: Staff) {
    const userData: {
      username: string,
      roles: string[],
      _token: string,
      _expiration: Date,
      staff: Staff | undefined
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) return;
    const loggedUser = new LoggedUser(userData.username, userData.roles, userData._token, new Date(userData._expiration), staff);
    this.user.next(loggedUser);
    localStorage.setItem('userData', JSON.stringify(loggedUser));
  }

}
