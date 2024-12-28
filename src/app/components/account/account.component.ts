import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {AuthService} from "../../services/auth.service";
import {StaffService} from "../../services/staff.service";
import {LoggedUser} from "../../model/logged-user.model";
import {Staff} from "../../model/staff.model";
import {User} from "../../model/user.model";
import {EmailValidationService} from "../../services/email-validation.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../services/ui-element.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private staffService: StaffService,
    private emailValidationService: EmailValidationService,
    public uiElementService: UiElementService) { }

  firstName: string = "";
  lastName: string = "";
  username: string = "";
  initial: boolean = false;
  roles: string[] = [];
  editMode: boolean = false;
  mode: string = "view";
  _firstName: string = "";
  _lastName: string = "";
  _inProgress: boolean = false;
  staff?: Staff;
  _newPassword: string = "";
  _newEmail: string = "";
  _message: string = "";

  loadStaffByEmail$!: Subscription;
  updateFirstAndLastNameStaff$!: Subscription;
  checkIfEmailExist$!: Subscription;
  changeEmail$!: Subscription;
  changePassword$!: Subscription;

  ngOnDestroy() {
      if (this.loadStaffByEmail$) this.loadStaffByEmail$.unsubscribe();
      if (this.updateFirstAndLastNameStaff$) this.updateFirstAndLastNameStaff$.unsubscribe();
      if (this.checkIfEmailExist$) this.checkIfEmailExist$.unsubscribe();
      if (this.changeEmail$) this.changeEmail$.unsubscribe();
      if (this.changePassword$) this.changePassword$.unsubscribe();
  }

  ngOnInit(): void {

    if (this.authService.user.value?.username) {
      this.username = this.authService.user.value?.username;
    }

    if (this.authService.user.value?.roles) {
      this.roles = this.authService.user.value?.roles;
    }

    if (this.authService.user.value?.username) {
      //console.log("ACCOUNT IS HERE");
      this.loadStaffByEmail$ = this.staffService.loadStaffByEmail(this.authService.user.value?.username).subscribe({
        next: value => {
          this.staff = structuredClone(value);
          this.firstName = value.firstName;
          this.lastName = value.lastName;
          this.initial = value.user.initial;
        },
        error: err => {

        }
      })
    } else {
      console.log("ACCOUNT IS NOT HERE");
    }

  }

  logout() {
    this.authService.logout();
  }

  edit () {
    this.editMode = true;
  }

  setMode(mode: string) {
    if (mode === 'edit') {
      this._firstName = this.firstName;
      this._lastName = this.lastName;
    }
    if (mode === 'email') {
      this._newEmail = this.username;
    }
    this.mode = mode;
  }

  updateFirstAndLastName() {
    this._inProgress = true;
    if (this.staff) {
      let staffToUpd = structuredClone(this.staff);
      staffToUpd.firstName = this._firstName;
      staffToUpd.lastName = this._lastName;
      this.updateFirstAndLastNameStaff$ = this.staffService.updateFirstAndLastNameStaff(staffToUpd).subscribe({
        next: value => {
          this.staff = structuredClone(value);
          this.firstName = value.firstName;
          this.lastName = value.lastName;
          this.mode = "view";
          this._inProgress = false;
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }


  updateEmail() {
    this._message = "";
    if (this._newEmail.trim() === this.username) return;
    this._inProgress = true;

    if (!this.emailValidationService.isEmailValidSimpleCheck(this._newEmail.trim())) {
      this._message = "Email contains gaps or too short";
      this._inProgress = false;
      return;
    }

    this.emailValidationService.emailDomainValidation(this._newEmail.trim()).subscribe({
      next: value => {
        if (value) {
          this.checkIfEmailExist$ = this.userService.checkIfEmailExist(this._newEmail).subscribe({
            next: value => {
              if (!value) {
                this._message = "";
                let userToUpdate: User = {
                  email: this.authService.user.value?.username!, // CURRENT EMAIL
                  password: this._newEmail.trim(), // NEW EMAIL
                  confirmed: false,
                  initial: false,
                  roles: []
                };
                this.changeEmail$ = this.userService.changeEmail(userToUpdate).subscribe({
                  next: value => {
                    this.mode = "view";
                    this._inProgress = false;
                    this.authService.logout();
                  }
                })
              } else {
                this._inProgress = false;
                this._message = "This email is already used";
              }
            }
          })
        } else {
          this._message = "Email domain not found";
          this._inProgress = false;
          return;
        }
      }
    })
  }

  updatePassword() {
    if (!this.userService.validatePassword(this._newPassword.trim())) {
      this._message = "Password is too short or contains gaps";
      return;
    }
    this._inProgress = true;
    let userToUpdate: User = {
      email: this.authService.user.value?.username!,
      password: this._newPassword,
      confirmed: false,
      initial: false,
      roles: []
    };
    this.changePassword$ = this.userService.changePassword(userToUpdate).subscribe({
      next: value => {
        this.mode = "view";
        this._inProgress = false;
        this.authService.logout();
      }
    })
  }

}
