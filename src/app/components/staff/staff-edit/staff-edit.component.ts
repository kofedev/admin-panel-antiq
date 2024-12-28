import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Staff} from "../../../model/staff.model";
import {AuthService} from "../../../services/auth.service";
import {StaffService} from "../../../services/staff.service";
import {EmailValidationService} from "../../../services/email-validation.service";
import {UsersService} from "../../../services/users.service";
import {User} from "../../../model/user.model";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-staff-edit',
  templateUrl: './staff-edit.component.html',
  styleUrls: ['./staff-edit.component.scss']
})
export class StaffEditComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService,
              private emailValidationService: EmailValidationService,
              private userService: UsersService,
              private staffService: StaffService,
              public uiElementService: UiElementService) {}

  params$!: Subscription;
  loadStaffByEmail$!: Subscription;
  updateFirstAndLastNameStaff$!: Subscription;
  emailDomainValidation$!: Subscription;
  deleteStaff$!: Subscription;
  changeSingleRoleUser$!: Subscription;
  changePassword$!: Subscription;
  checkIfEmailExist$!: Subscription;
  changeEmail$!: Subscription;
  updateStaffReceiverMailsStatus$!: Subscription;

  ngOnDestroy() {
    if (this.params$) this.params$.unsubscribe();
    if (this.loadStaffByEmail$) this.loadStaffByEmail$.unsubscribe();
    if (this.updateFirstAndLastNameStaff$) this.updateFirstAndLastNameStaff$.unsubscribe();
    if (this.emailDomainValidation$) this.emailDomainValidation$.unsubscribe();
    if (this.deleteStaff$) this.deleteStaff$.unsubscribe();
    if (this.changeSingleRoleUser$) this.changeSingleRoleUser$.unsubscribe();
    if (this.changePassword$) this.changePassword$.unsubscribe();
    if (this.checkIfEmailExist$) this.checkIfEmailExist$.unsubscribe();
    if (this.changeEmail$) this.changeEmail$.unsubscribe();
    if (this.updateStaffReceiverMailsStatus$) this.updateStaffReceiverMailsStatus$.unsubscribe();
  }

  ngOnInit(): void {
    // Access the route parameter
    this.params$ = this.route.params.subscribe(params => {
      this.staffEmail = params['staffEmail'];
      if (this.staffEmail != undefined) this.loadStaffByEmail(this.staffEmail);
    });
  }

  staffEmail: string | undefined;

  _staff!: Staff; // local buffer

  _newEmail: string = "";     // field
  _newFirstName: string = ""; // field
  _newLastName: string = "";  // field
  _newPassword: string = "";  // field

  _inProgress: boolean = false;
  _message: string = "";
  _askToConfirm: boolean = false;
  _showAfterUpdatedMessage: boolean = false;

  loadStaffByEmail(email: string) {
    this.loadStaffByEmail$ = this.staffService.loadStaffByEmail(email).subscribe({
      next: value => {
        if (value != null) {
          this._staff = structuredClone(value); // local buffer
          this._message = "";
          this._newEmail = value.user.email;
          this._newFirstName = value.firstName;
          this._newLastName = value.lastName;
          this._newPassword = "";
        } else {
          this.router.navigateByUrl("/staff").then(r => console.log("Routing"));
        }
      }
    })
  }

  returnToViewMode() {
    this.router.navigateByUrl("/staff").then(r => console.log("Routing"));
  }

  updateStaffName() {
    this._message = "";
    if (this._newFirstName.trim() != this._staff.firstName || this._newLastName.trim() != this._staff.lastName) {
      this._inProgress = true;
      let staffToUpd = structuredClone(this._staff);
      staffToUpd.firstName = this._newFirstName;
      staffToUpd.lastName = this._newLastName;
      this.updateFirstAndLastNameStaff$ = this.staffService.updateFirstAndLastNameStaff(staffToUpd).subscribe({
        next: value => {
          this._staff = structuredClone(value);
          this._message = "";
          this._newEmail = value.user.email;
          this._newFirstName = value.firstName;
          this._newLastName = value.lastName;
          this._newPassword = "";
          this._inProgress = false;
          this._showAfterUpdatedMessage = true;
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  unDoData() {
    this._message = "";
    this._newEmail = this._staff.user.email;
    this._newFirstName = this._staff.firstName;
    this._newLastName = this._staff.lastName;
    this._newPassword = "";
  }

  updateStaffEmail () {
    this._message = "";
    if (this._newEmail.trim() != this._staff.user.email) {
      this._inProgress = true;
      if (!this.emailValidationService.isEmailValidSimpleCheck(this._newEmail.trim())) {
        this._message = "Email contains gaps or too short";
        this._inProgress = false;
        return;
      }
      this.emailDomainValidation$ = this.emailValidationService.emailDomainValidation(this._newEmail.trim()).subscribe({
        next: value => {
          if (value) {
            // email domain exists
            this.checkIfEmailExist$ = this.userService.checkIfEmailExist(this._newEmail.trim()).subscribe({
              next: value => {
                if (!value) {
                  let userToUpdate: User = {
                    email: this._staff.user.email, // CURRENT EMAIL
                    password: String(this._newEmail.trim()), // NEW EMAIL
                    confirmed: false,
                    initial: false,
                    roles: []
                  };
                  this.changeEmail$ = this.userService.changeEmail(userToUpdate).subscribe({
                    next: value => {
                      this._inProgress = false;
                      this.returnToViewMode();
                    }
                  })
                } else {
                  this._inProgress = false;
                  this._message = "This email is already used"; // @ToDo MESSAGE!
                }
              }
            })
          } else {
            this._message = "Email domain not found"; // @ToDo MESSAGE!
            this._inProgress = false;
            return;
          }
        }
      })
    }
  }

  updateStaffPassword() {
    this._message = "";
    if (!this.userService.validatePassword(this._newPassword.trim())) {
      this._message = "Password is too short or contains gaps"; //@ToDo MESSAGE!!!
      return;
    }
    this._inProgress = true;
    let userToUpdate: User = {
      email: this._staff.user.email,
      password: String(this._newPassword),
      confirmed: false,
      initial: false,
      roles: []
    };
    this.changePassword$ = this.userService.changePassword(userToUpdate).subscribe({
      next: value => {
        this._newPassword = "";
        this._inProgress = false;
        this._showAfterUpdatedMessage = true;
      }
    })
  }

  updateStaffRole() {
    this._inProgress = true;
    let user: User = {
      email: this._staff.user.email,
      password: '',
      confirmed: true,
      initial: false,
      roles: []
    }
    this.changeSingleRoleUser$ = this.userService.changeSingleRoleUser(user).subscribe({
      next: value => {
        this.loadStaffByEmail(this._staff.user.email);
        this._inProgress = false;
        this._showAfterUpdatedMessage = true;
      }
    })
  }

  deleteStaff() {
    this._message = "";
    if (this._staff.user.email != this.authService.user.value?.username) {
      this._askToConfirm = true;
    }
  }

  deleteStaffProcess() {
    this._inProgress = true;
    this.deleteStaff$ = this.staffService.deleteStaff(this._staff.staffId).subscribe({
      next: value => {
        this._inProgress = false;
        this._askToConfirm = false;
        this.returnToViewMode();
      }
    })
  }

  updateReceiverMailsStatus() {
    this._inProgress = true;
    this._staff.isReceiverMails = !this._staff.isReceiverMails;
    this.updateStaffReceiverMailsStatus$ =
      this.staffService.updateStaffReceiverMailsStatus(this._staff).subscribe({
      next: value => {
        this._staff = structuredClone(value);
        this._inProgress = false;
        this._showAfterUpdatedMessage = true;
      }
    })
  }

}
