import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {exhaustMap, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
    // console.log("USER: " + this.authService.user.value?.username);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.authService.user.pipe(take(1), exhaustMap(user => {
      if (!user) {
        // console.log("user is NOT exist");
        this.authService.logout();
        return next.handle(req);
      }
      // console.log("user is exist");
      const modifiedRequest = req.clone({headers: new HttpHeaders({'Authorization': "Bearer " + user.token})});
      return next.handle(modifiedRequest);
    }))
  }
}
