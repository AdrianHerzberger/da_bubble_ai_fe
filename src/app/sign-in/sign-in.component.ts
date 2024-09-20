import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service-moduls/authentication.service';
import { Router } from '@angular/router';
import { APIClient } from 'output';
import { UserDataService, UserDataTypes } from '../service-moduls/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  isSignIn: boolean = false;
  submitted: boolean = false;
  userNotFound: boolean = false;
  emailNotVerify: boolean = false;


  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    public authenticationService: AuthenticationService,
  ) { }

  signIn() {
    this.submitted = true;
    if (this.signInForm.valid) {
      const user: UserDataTypes = {
        userEmail: this.signInForm.value.email?.toLowerCase() || '',
        userPassword: this.signInForm.value.password ?? '',
      }
      this.authenticationService.signInUser(user.userEmail, user.userPassword)
      this.isFormValid();
    } else if (this.signInForm.invalid) {
      this.isFormInvalid();
      this.showError('userNotFound');
    }
    else {
      this.router.navigateByUrl('/sign-in');
      this.showError('emailNotVerify');
    }
  }

  showError(errorType: 'userNotFound' | 'emailNotVerify') {
    this[errorType] = true;
    if (errorType === 'userNotFound') {
      this.emailNotVerify = false;
    } else if (errorType === 'emailNotVerify') {
      this.userNotFound = false;
    }
  }

  isFormValid() {
    this.signInForm.disable();
    this.isSignIn = true;
    this.submitted = true;
  }

  isFormInvalid() {
    setTimeout(() => {
      this.signInForm.enable();
      this.isSignIn = false;
      this.submitted = false;
      this.userNotFound = true
    }, 1500);
  }

}