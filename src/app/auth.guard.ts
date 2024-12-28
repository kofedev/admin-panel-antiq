import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute,
  CanActivateFn,
  Router} from "@angular/router";

import {Staff} from "./model/staff.model";
import {inject} from "@angular/core";

export function AuthGuard(role: string[]): CanActivateFn {

  return () => {

      const router = inject(Router);
      const userData: {
      username: string,
      roles: string[],
      _token: string,
      _expiration: Date,
      staff: Staff | undefined
      } = JSON.parse(localStorage.getItem('userData')!);

      if (userData) {
        //console.log("AUTH - OK");
        if (role.some(r => userData.roles.includes(r))) {
          //console.log("INCLUDES " + role);
          return true;
        } else {
          return false;
          //return router.navigateByUrl("/auth");
        }
      } else {
        //console.log("AUTH - NOT OK");
        return router.navigateByUrl("/auth");
      }

  }

}





