import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMessageType, ERedirect, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { ILoginData } from '@smart-study-graz/ngx-smartstudy-auth/lib/types/login';
import { take } from 'rxjs/operators';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  private _verification_success_message: string = 
    $localize`:SuccessfullyVerification|Successfully verified email message@@smartauthoring.login.emailSuccessfullyVerified:Email successfully verified`;

  constructor(
    private _authoringApi: AuthoringApiService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService
  ) { }
  
  /**
   * ngOnInit
   * Checks the activated route snapshot for an activation key. If so, displays a message.
   */
  public ngOnInit(): void {
    let key: string | null = this._activatedRoute.snapshot.queryParamMap.get('key');
    if(key != null) {
      this._authoringApi.authService.confirmEmail({ key: key }).pipe(take(1)).subscribe(
        _ => this._messageService.showMessage({  type: EMessageType.eSuccess, text: this._verification_success_message })
      );
    }
  }

  /**
   * Login callback from the view
   */
  public login(loginData: ILoginData): void {
    this._authoringApi.authService.login({ email: loginData.email, password: loginData.password }).pipe(
      take(1),
    ).subscribe(
      _ => this._router.navigate(['main/dashboard']),
      (error: SmartAuthoringBackendError) => this._messageService.showMessage({ type: EMessageType.eError, text: error.message })
    );
  }

  /**
   * Redirect callback from the view
   */
  public performRedirect(redirect: ERedirect) : void { 
    switch(redirect) {
      case ERedirect.eRedirectSignup:
        this._router.navigate(['../signup']);
        return;
      case ERedirect.eRedirectForgotPassword:
        this._router.navigate(['../requestPasswordReset']);
    }
  }

}
