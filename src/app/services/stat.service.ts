import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {Staff} from "../model/staff.model";
import {Stat} from "../model/stat";

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {}

  public getStat(): Observable<Stat> {
    return this.http.get<Stat>(this.environment.baseUrl + "/admin/stat");
  }

}
