import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../service-moduls/validation.service';
import { AuthenticationService } from '../service-moduls/authentication.service';
import { Router } from '@angular/router';
import { APIClient } from 'output';
import { UserDataService, UserDataInterface, UserDataTypes } from '../service-moduls/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  isSignUp: boolean = false;
  submitted: boolean = false;
  showSlideInNotification: boolean = false;
  emailExists: boolean = false;
  usernameExists: boolean = false;

  signUpForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
      Validators.pattern(/^[a-zA-Z-]+\s[a-zA-Z-]+$/),
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    ]),

    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    ]),

    confirmPassword: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private router: Router, 
    private userDataService: UserDataService,
    public ValidationService: ValidationService, 
    public authenticationService: AuthenticationService,
    public apiClient: APIClient
  ) { }

  signUp() {
    this.submitted = true;
    if (this.signUpForm.valid) {
      const user:  UserDataTypes = {
        userName: this.signUpForm.value.name?.toLowerCase() || '',
        userEmail: this.signUpForm.value.email?.toLowerCase() || '',
        userPassword: this.signUpForm.value.password ?? ''
      }
      this.authenticationService.registerUser(user.userName, user.userEmail, user.userPassword)
      this.showsNotificationAnimation();
      this.resetForm();
      this.router.navigateByUrl("/sign-in");
    }
    this.disableForm();
  }

  showsNotificationAnimation() {
    this.showSlideInNotification = true;
    setTimeout(() => {
      this.showSlideInNotification = false;
    }, 3000);
  }

  resetExistsError(errorType: 'usernameExists' | 'emailExists') {
    setTimeout(() => {
      this[errorType] = false;
    }, 3000);
  }

  disableForm() {
    this.signUpForm.disable();
    this.isSignUp = true;
  }

  resetForm() {
    setTimeout(() => {
      this.signUpForm.reset();
      this.signUpForm.enable();
      this.isSignUp = false;
      this.submitted = false;
    }, 3500);
  }

}