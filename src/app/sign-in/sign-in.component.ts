import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../service-moduls/authentication.service';
import { Router } from '@angular/router';
import { APIClient } from 'output';
import { UserDataService } from '../service-moduls/user.service';

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
    private userDataService: UserDataService,
    private apiClient: APIClient
  ) { }

  validateUserCredentials() {
    this.submitted = true;
    const userEmail: string = this.signInForm.value.email?.toLowerCase() || '';
    const userPassword = this.signInForm.value.password ?? '';
    this.signInUser(userEmail, userPassword);
  }

  async signInUser(userEmail: string, userPassword: string) {
    if (userEmail && userPassword) {
      const userProfilePictureUrl = this.userDataService.createProfileAvatar();
      this.apiClient.postApiSignInUser({
        user_email: userEmail,
        user_password: userPassword,
        user_profile_picture_url: userProfilePictureUrl
      }).subscribe({
        next: (response) => {
          console.log('User logged in successfully:', response);
          this.isFormValid();
          this.authenticationService.getUserData(userEmail);
        },
        error: (error: any) => {
          console.error('Error logging in user:', error);
          if (error.error === 'emailNotVerified') {
            this.showError('userNotFound');
          }
          this.isFormInvalid();
        }
      });
    } else {
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