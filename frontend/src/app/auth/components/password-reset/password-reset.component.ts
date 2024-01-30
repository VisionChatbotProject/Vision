import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMessageType, ERedirect, IPasswordResetData, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { take } from 'rxjs/operators';
import { IConfirmPasswordResetRequest } from 'src/app/core/models/auth';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
  providers: [MessageService]
})
export class PasswordResetComponent implements OnInit {

  private _invalid_link_error: string = 
    $localize`:InvalidLink|Invalid link for password reset@@smartauthoring.passwordReset.invalidLink:This password reset link is invalid`;
 
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authoringApi: AuthoringApiService,
    private _messageService: MessageService,
  ) { 
  }

  ngOnInit(): void {
  }

  /**
   * Redirect callback from the view
   */
   public performRedirect(redirect: ERedirect): void { 
    switch(redirect) {
      case ERedirect.eRedirectLogin:
        this._router.navigate(['../login']);
    }
  }

  /**
   * Redirect callback from the view
   */
  public performReset(formData: IPasswordResetData): void {
    let uid: string | null = this._activatedRoute.snapshot.queryParamMap.get('uid');
    let token: string | null = this._activatedRoute.snapshot.queryParamMap.get('token');
    
    if(uid && token) {
      let data: IConfirmPasswordResetRequest = {
        uid: uid,
        token: token,
        new_password1: formData.password,
        new_password2: formData.passwordRepeat
      }

      this._authoringApi.authService.confirmPasswordReset(data).pipe(
        take(1),
      ).subscribe(
        response => this._messageService.showMessage({ type: EMessageType.eSuccess, text: response.detail }),
        (error: SmartAuthoringBackendError) => this._messageService.showMessage({ type: EMessageType.eError, text: error.message })
      );
    }
  
    else {
      this._messageService.showMessage({ type: EMessageType.eError, text: this._invalid_link_error });
    }
  }

}
