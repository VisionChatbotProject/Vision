import { Component, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMessageType, ERedirect, ISignupData, MessageService, SignupConfig } from '@smart-study-graz/ngx-smartstudy-auth';
import { take } from 'rxjs/operators';
import { ISignupRequest } from 'src/app/core/models/auth';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [MessageService]
})
export class SignupComponent {

  constructor(
    private _authoringApi: AuthoringApiService,
    private _router: Router,
    private _signupConfig: SignupConfig,
    private _messageService: MessageService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this._signupConfig.enableTitleNamePrefix = false;
    this._signupConfig.enableTitleNameSuffix = false;
   }

  /**
   * Signup callback from the view
   */
  public signup(signupForm: ISignupData): void {
    let code: string | null = this._activatedRoute.snapshot.queryParamMap.get('code');

    let signupData: ISignupRequest = {
      email: signupForm.email,
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      password1: signupForm.password,
      password2: signupForm.passwordConfirm
    };

    if(code) {
      // clear key in local storage
      localStorage.removeItem('key');

      this._authoringApi.authService.redeem(signupData, code).pipe(
        take(1),
      ).subscribe(
        _ => this._router.navigate(['../login']),
        (error: SmartAuthoringBackendError) => this._messageService.showMessage({ type: EMessageType.eError, text: error.message })
      );
    }
    else {
      this._authoringApi.authService.signup(signupData).pipe(
        take(1),
      ).subscribe(
        response => this._messageService.showMessage({ type: EMessageType.eSuccess, text: response.detail }),
        (error: SmartAuthoringBackendError) => this._messageService.showMessage({ type: EMessageType.eError, text: error.message })
      );
    }
  }

  /**
   * Redirect callback from the view
   */
  public performRedirect(redirect: ERedirect) : void { 
    switch(redirect) {
      case ERedirect.eRedirectLogin:
        this._router.navigate(['../login']);
    }
  }

}
