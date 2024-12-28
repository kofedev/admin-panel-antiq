import {Component, OnDestroy, OnInit} from '@angular/core';
import {StaffService} from "../../services/staff.service";
import {Staff} from "../../model/staff.model";
import {UsersService} from "../../services/users.service";
import {User} from "../../model/user.model";
import {AuthService} from "../../services/auth.service";
import {EmailValidationService} from "../../services/email-validation.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, OnDestroy {

  constructor(private staffService: StaffService,
              public authService: AuthService,
              private router: Router,
              public uiElementService: UiElementService) {
  }

  staffList: Staff[] = [];

  findAllStaff$!: Subscription;

  ngOnDestroy() {
    if (this.findAllStaff$) this.findAllStaff$.unsubscribe();
  }

  ngOnInit(): void {
    this.loadStaffList()
  }

  loadStaffList () {
    this.findAllStaff$ = this.staffService.findAllStaff().subscribe({
      next: value => {
        this.staffList = structuredClone(value);
      }
    })
  }

  goToEditStaff(staffEmail: string) {
    this.router.navigateByUrl("/staff/edit/" + staffEmail).then(r => console.log("Routing"));
  }

  goingToNewStaff() {
    this.router.navigateByUrl("/staff/new").then(r => console.log("Routing"));
  }

}
