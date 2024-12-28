import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {UsersService} from "../../services/users.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  loginFormGroup!: FormGroup;
  submitted: boolean = false;
  errorMessage!: string;
  mode: string = 'login';
  _inProgress: boolean = false;
  _message: string = "";

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private userService: UsersService) {
  }

  login$!: Subscription;
  passwordRestore$!: Subscription;

  ngOnDestroy() {
    if (this.login$) this.login$.unsubscribe();
    if (this.passwordRestore$) this.passwordRestore$.unsubscribe();
  }

  ngOnInit(): void {

    this.loginFormGroup = this.fb.group({
      username: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ["", Validators.required],
    })
  }

  onLogin() {
    this.submitted = true;
    if (this.loginFormGroup.invalid) return;
    this.login$ = this.authService.login(this.loginFormGroup.value).subscribe({
      next: loginResponse => {
        // console.log("Hello, cats! " + loginResponse.accessToken);
        // console.log("Hello, cats! " + loginResponse.refreshToken);
        this.authService.saveToken(loginResponse);
      },
      error: err => {
        console.log(err);
        this.errorMessage = "An error occurred";
      }
    })
  }

  restorePassByEmail() {
    this._inProgress = true;
    this.passwordRestore$ = this.userService.passwordRestore(this.loginFormGroup.value.username).subscribe({
      next: value => {
        this._message = value.message;
        this.mode = 'after_restore';
        this._inProgress = true;
      }
    })
  }
}
