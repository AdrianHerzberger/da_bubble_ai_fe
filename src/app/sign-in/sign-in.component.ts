import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service-moduls/authentication.service';
import { Router } from '@angular/router';
import { APIClient } from 'output';

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
    private apiClient: APIClient
  ) { }

  validateUserCredentials() {
    this.submitted = true;
    this.disableForm();
    const userEmail: string = this.signInForm.value.email?.toLowerCase() || '';
    const userPassword = this.signInForm.value.password ?? '';
    this.signInUser(userEmail, userPassword);
  }

  async signInUser(userEmail: string, userPassword: string) {
    if (userEmail && userPassword) {
      this.apiClient.postApiSignInUser({
        user_email: userEmail,
        user_password: userPassword
      }).subscribe({
        next: (response) => {
          console.log('User logged in successfully:', response);
          this.authenticationService.getUserData(userEmail);
        },
        error: (error: any) => {
          console.error('Error loging in user:', error);
        },
        complete: () => {
          console.log('User login complete.');
        }
      });
    } else {
      this.router.navigateByUrl('/sign-in');
      this.showError('emailNotVerify');
    }
  }

  checkError() {
    if (this.authenticationService.errorMessage === 'auth/wrong-password' || 
      this.authenticationService.errorMessage === 'auth/user-not-found') {
      this.showError('userNotFound')
    }
  }

  showError(errorType: 'userNotFound' | 'emailNotVerify') {
    this[errorType] = true;
    setTimeout(() => {
      this[errorType] = false;
    }, 5000);
  }

  disableForm() {
    this.signInForm.disable();
    this.isSignIn = true;
  }

  enableForm() {
    setTimeout(() => {
      this.signInForm.enable();
      this.isSignIn = false;
      this.submitted = false;
    }, 3500);
  }

}