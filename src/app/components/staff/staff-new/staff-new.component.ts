import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {StaffService} from "../../../services/staff.service";
import {UsersService} from "../../../services/users.service";
import {EmailValidationService} from "../../../services/email-validation.service";
import {Subscription} from "rxjs";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-staff-new',
  templateUrl: './staff-new.component.html',
  styleUrls: ['./staff-new.component.scss']
})
export class StaffNewComponent implements OnDestroy {

  constructor(private router: Router,
              private userService: UsersService,
              private emailValidationService: EmailValidationService,
              private staffService: StaffService,
              public uiElementService: UiElementService) {}

  _inProgress: boolean = false;

  _newFirstName: string = "";
  _newLastName: string = "";
  _newEmail: string = "";
  _newPassword: string = "";

  saveStaff$!: Subscription;
  checkIfEmailExist$!: Subscription;
  emailDomainValidation$!: Subscription;

  ngOnDestroy() {
    if (this.saveStaff$) this.saveStaff$.unsubscribe();
    if (this.checkIfEmailExist$) this.checkIfEmailExist$.unsubscribe();
    if (this.emailDomainValidation$) this.emailDomainValidation$.unsubscribe();
  }

  _msg_FirstNameIsNecessary = false;
  _msg_PasswordIsNecessary = false;
  _msg_EmailIsNecessary = false;
  _msg_EnterCorrectEmail = false;
  _msg_EnterCorrectPassword = false;
  _msg_EmailAlreadyUsed = false;
  _msg_EmailDomainNotFound = false;
  hideAllMessages = () => {
    this._msg_FirstNameIsNecessary = false;
    this._msg_PasswordIsNecessary = false;
    this._msg_EmailIsNecessary = false;
    this._msg_EnterCorrectEmail = false;
    this._msg_EnterCorrectPassword = false;
    this._msg_EmailAlreadyUsed = false;
    this._msg_EmailDomainNotFound = false;
  };


  saveNewStaff() {
    this.hideAllMessages();
    // Validation
    if (containsOnlySpaces(this._newFirstName) || this._newFirstName.length == 0) {
      this._msg_FirstNameIsNecessary = true;
      return;
    }
    if (containsOnlySpaces(this._newPassword) || this._newPassword.length == 0) {
      this._msg_PasswordIsNecessary = true;
      return;
    }
    if (containsOnlySpaces(this._newEmail) || this._newEmail.length == 0) {
      this._msg_EmailIsNecessary = true;
      return;
    }
    if (!isValidEmail(this._newEmail) ) {
      this._msg_EnterCorrectEmail = true;
      return;
    }
    if (!this.userService.validatePassword(this._newPassword.trim())) {
      this._msg_EnterCorrectPassword = true;
      return;
    }
    // Process
    this._inProgress = true;
    this.emailDomainValidation$ = this.emailValidationService.emailDomainValidation(this._newEmail.trim()).subscribe({
      next: value => {
        if (value) {
          // check if email already exist in the system
          this.checkIfEmailExist$ = this.userService.checkIfEmailExist(this._newEmail).subscribe({
            next: value => {
              if (!value) {
                // OK, going to save new staff
                // * 1 *
                let newStaff = {
                  staffId: 0,
                  firstName: this._newFirstName,
                  lastName: this._newLastName,
                  user: {
                    email: this._newEmail,
                    password: this._newPassword,
                    confirmed: false,
                    initial: false,
                    roles: []
                  }
                };
                // * 2 *
                this.saveStaff$ = this.staffService.saveStaff(newStaff).subscribe({
                  next: value => {
                    this._inProgress = false;
                    this.returnToViewMode();
                  }
                })
              // Email is already used
              } else {
                this._inProgress = false;
                this.hideAllMessages();
                this._msg_EmailAlreadyUsed = true;
              }
            }
          })
        } else {
          this.hideAllMessages();
          this._msg_EmailDomainNotFound = true;
          this._msg_EnterCorrectEmail = true;
          this._inProgress = false;
          return;
        }
      }
    })

    function containsOnlySpaces(input: string): boolean {
      // Check if the input consists only of spaces
      //console.log("STRING: " + input + " TEST: " + /^\s*$/.test(input));
      return /^\s*$/.test(input);
    }

    function isValidEmail(email: string): boolean {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if the email matches the regular expression
      return emailRegex.test(email);
    }
  }

  undoData() {
    this._newFirstName = "";
    this._newLastName = "";
    this._newEmail = "";
    this._newPassword = "";
  }

  returnToViewMode() {
    this.router.navigateByUrl("/staff").then(r => console.log("Routing"));
  }

}
