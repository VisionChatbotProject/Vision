import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMessageType, ERedirect, IRequestPasswordResetData, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { take } from 'rxjs/operators';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';

@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.scss'],
  providers: [MessageService]
})
export class RequestPasswordResetComponent implements OnInit {

  constructor(
    private _router: Router,
    private _authoringApi: AuthoringApiService,
    private _messageService: MessageService,
  ) { }

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
  public requestPasswordReset(formData: IRequestPasswordResetData): void { 
    this._authoringApi.authService.requestPasswordReset({ email: formData.email }).pipe(
      take(1),
    ).subscribe(
      response => this._messageService.showMessage({ type: EMessageType.eSuccess, text: response.detail }),
      (error: SmartAuthoringBackendError) => this._messageService.showMessage({ type: EMessageType.eError, text: error.message })
    );
  }

}
