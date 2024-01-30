import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { IConfirmEmailRequest, IConfirmPasswordResetRequest, ILoginRequest, IPasswordResetRequest, ISignupRequest, IToken } from 'src/app/core/models/auth';
import { IBackendMessage } from 'src/app/core/models/base';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';
import { IInvite } from 'src/app/core/models/invite';


/**
 * The Authentication service responsible for login and logout of users
 * This service is primarily used for basic user handling without
 * any real business logic.
 * It is discouraged to use this service directly,
 * instead access it by injecting the {@link AuthoringApiService} service.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Attempts to login with the provided credentials
   * If the login attempt succeeds, the authorization token is 
   * stored in the local storage.
   * 
   * @param credentials {@link ILoginRequest} containing username and password
   * @returns an {@link Observable} of type {@link IToken} containing the token.
   */
  public login(credentials: ILoginRequest): Observable<IToken> {
    return this._httpClient.post<IToken>(environment.apiUrl + '/auth/login/', credentials, { withCredentials: true }).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Logs out the currently logged in user. 
   * Removes the stored authorization token from the local storage.
   * 
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public logout(): Observable<IBackendMessage> {
    return this._httpClient.post<IBackendMessage>(environment.apiUrl + '/auth/logout/', {}).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Logs out the currently logged in user. 
   * Removes the stored authorization token from the local storage.
   * 
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public signup(signupData: ISignupRequest): Observable<IBackendMessage> {
    return this._httpClient.post<IBackendMessage>(environment.apiUrl + '/auth/register', signupData).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Redeems a code for a user. 
   * 
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public redeem(signupData: ISignupRequest, code: string): Observable<IInvite> {
    return this._httpClient.put<IInvite>(`${environment.apiUrl}/auth/invite/${code}`, signupData).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Confirms the email adress associated with the given key.
   * 
   * @param key {@link IConfirmEmailRequest} containing the key for verification
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public confirmEmail(key: IConfirmEmailRequest): Observable<IBackendMessage> {
    return this._httpClient.post<IBackendMessage>(environment.apiUrl + '/auth/account-confirm-email/', key).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Request Password Reset
   * Requests a password reset in the backend. 
   * 
   * @param resetData {@link IPasswordResetRequest} containing the email
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public requestPasswordReset(data: IPasswordResetRequest): Observable<IBackendMessage> {
    return this._httpClient.post<IBackendMessage>(environment.apiUrl + '/auth/password/reset/', data).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Confirm Password Reset
   * Confirms the password reset with the new passwords
   * 
   * @param resetData {@link IConfirmPasswordResetRequest} containing the new password
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public confirmPasswordReset(data: IConfirmPasswordResetRequest): Observable<IBackendMessage> {
    return this._httpClient.post<IBackendMessage>(environment.apiUrl + '/auth/password/reset/confirm/', data).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    if (e.error['non_field_errors']) { errorMessage = e.error['non_field_errors'].join(', '); }
    if (e.error['email']) { errorMessage = e.error['email'].join(', '); }
    if (e.error['password1']) { errorMessage = e.error['password1'].join(', '); }
    if (e.error['password2']) { errorMessage = e.error['password2'].join(', '); }
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }
}
