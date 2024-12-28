import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {EnvironmentService} from "./environment.service";
import {PageResponse} from "../model/page.response.model";
import {Staff} from "../model/staff.model";

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {}

  public findAllStaff(): Observable<Array<Staff>> {
    return this.http.get<Array<Staff>>(this.environment.baseUrl + "/staff/all");
  }

  public deleteStaff(staffId: number) {
    return this.http.delete(this.environment.baseUrl + "/staff/" + staffId);
  }

  public saveStaff(staff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.environment.baseUrl + "/staff", staff);
  }

  public loadStaffByEmail(email: string): Observable<Staff> {
    return this.http.get<Staff>(this.environment.baseUrl + "/staff/find?email=" + email)
  }

  public updateFirstAndLastNameStaff(staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(this.environment.baseUrl + "/staff/name", staff);
  }

  public updateStaffReceiverMailsStatus(staff: Staff): Observable<Staff> {
    return this.http.put<Staff>(this.environment.baseUrl + "/staff/receiver", staff);
  }

}
