import { Observable } from "rxjs";
import { IConfirmEmailRequest, IConfirmPasswordResetRequest, ILoginRequest, IPasswordResetRequest, ISignupRequest, IToken } from "../../models/auth";
import { IBackendMessage } from "../../models/base";
import { IInvite } from "../../models/invite";

/**
 * Base interface definition for AuthBackendServices
 */
export interface IAuthService {

  /**
   * Base method for log in.
   * 
   * @param credentials {@link ILoginRequest} containing username and password
   * @returns an {@link Observable} of type {@link IToken} containing the token.
   */
  login(credentials: ILoginRequest): Observable<IToken>;

  /**
   * Base method for log out.
   * Removes the stored authorization token from the local storage.
   * 
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  logout() : Observable<IBackendMessage>

  /**
   * Base method for signup
   * 
   * @param signupData {@link ISignupRequest} containing necessary information for signup
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  signup(signupData: ISignupRequest): Observable<IBackendMessage>

  /**
   * Base method for code redeem
   * 
   * @param signupData {@link ISignupRequest} containing necessary information for code redeem
   * @param code the code to redeem
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  redeem(signupData: ISignupRequest, code: string): Observable<IInvite>

  /**
   * Base method for confirming email adresses
   * 
   * @param key {@link IConfirmEmailRequest} containing the key for verification
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  confirmEmail(key: IConfirmEmailRequest): Observable<IBackendMessage>

  /**
   * Base method for request password reset
   * 
   * @param resetData {@link IPasswordResetRequest} containing the email
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  requestPasswordReset(data: IPasswordResetRequest) : Observable<IBackendMessage>

  /**
   * Base method for password reset
   * 
   * @param resetData {@link IConfirmPasswordResetRequest} containing the new password
   * @returns an {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  confirmPasswordReset(data: IConfirmPasswordResetRequest) : Observable<IBackendMessage>
}