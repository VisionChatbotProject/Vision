import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { LoginComponent } from './components/login/login.component';
import { CoreModule } from '../core/core.module';
import { NgxSmartstudyAuthModule } from '@smart-study-graz/ngx-smartstudy-auth';
import { SignupComponent } from './components/signup/signup.component';
import { RequestPasswordResetComponent } from './components/request-password-reset/request-password-reset.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';


@NgModule({
  declarations: [
    OnboardingComponent,
    LoginComponent,
    SignupComponent,
    RequestPasswordResetComponent,
    PasswordResetComponent,
  ],
  imports: [
    CoreModule,
    AuthRoutingModule,
    NgxSmartstudyAuthModule,
  ]
})
export class AuthModule { }
