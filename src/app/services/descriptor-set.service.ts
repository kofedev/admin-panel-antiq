import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Descriptor} from "../model/descriptor";
import {DescriptorSet} from "../model/descriptor-set";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DescriptorSetService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {
  }


  public updateValueDescriptorsWrappedInDescriptorSet (descriptorSet: DescriptorSet): Observable<any> {
    return this.http.put<any>(this.environment.baseUrl + "/descrset/update-descr-only", descriptorSet);
  }

}
