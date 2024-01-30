import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  { 
    path : '', 
    component : OnboardingComponent,
    children : [
      { path : 'login?:key', component : LoginComponent },
      { path : 'login', component : LoginComponent },
      { path : 'signup', component : SignupComponent },
      { path : 'requestPasswordReset', component : RequestPasswordResetComponent },
      { path : 'resetPassword', component : PasswordResetComponent },
      { path : '', redirectTo : 'login', pathMatch : 'full' },
    ],

    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
