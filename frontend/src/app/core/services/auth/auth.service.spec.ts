import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { IConfirmEmailRequest, IConfirmPasswordResetRequest, ILoginRequest, IPasswordResetRequest, ISignupRequest, IToken } from 'src/app/core/models/auth';
import { IBackendMessage } from 'src/app/core/models/base';
import { environment } from 'src/environments/environment';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';

import { AuthService } from './auth.service';

describe('AuthBackendService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some failure';

  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', doneCallback => {
    let loginData: ILoginRequest = {
      email: 'dummy@login.com',
      password: 'aSuperSecurePassword'
    }

    let loginResponse: IToken = {
      key: 'abc',
    }

    service.login(loginData).subscribe(
      token => {
        expect(token).toEqual(loginResponse);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/auth/login/')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(loginResponse);
  }, TIMEOUT);

  it('should logout and clear the local storage', doneCallback => {
    let message: IBackendMessage = {
      detail: 'Successfully logged out.'
    };

    service.logout().subscribe(
      message => {
        expect(message).toEqual(message);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/auth/logout/')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(message);
  }, TIMEOUT);

  it('should signup', doneCallback => {
    let message: IBackendMessage = {
      detail: 'Successfully signed up'
    };

    let data: ISignupRequest = {
      email: 'test@mail.com',
      password1: 'securePassword',
      password2: 'securePassword',
      firstName: 'FirstName',
      lastName: 'LastName',
    }

    service.signup(data).subscribe(
      message => {
        expect(message).toEqual(message);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/auth/register')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(message);

  }, TIMEOUT);

  it('should confirm the email', doneCallback => {
    let expectedMessage: IBackendMessage = {
      detail: 'Successfully confirmed email'
    };

    let data: IConfirmEmailRequest = {
      key: 'abc'
    }

    service.confirmEmail(data).subscribe(
      message => {
        expect(message).toEqual(expectedMessage);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/auth/account-confirm-email/')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(expectedMessage);

  }, TIMEOUT);

  it('should request a new password', doneCallback => {
    let message: IBackendMessage = {
      detail: 'Password reset request successfull'
    };

    let data: IPasswordResetRequest = {
      email: 'test@mail.com',
    }

    service.requestPasswordReset(data).subscribe(
      message => {
        expect(message).toEqual(message);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/auth/password/reset/')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(message);

  }, TIMEOUT);

  it('should confirm a password reset', doneCallback => {
    let message: IBackendMessage = {
      detail: 'Password reset successfull'
    };

    let data: IConfirmPasswordResetRequest = {
      uid: '1',
      token: 'abc',
      new_password1: 'abc',
      new_password2: 'abc',
    }

    service.confirmPasswordReset(data).subscribe(
      message => {
        expect(message).toEqual(message);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/auth/password/reset/confirm/')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(message);
  }, TIMEOUT);

  // Error handler testcases
  it('error handler should handle "non_field_errors" gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('non_field_errors', errorMessage);
    handlesError(service.logout(), httpTestingController, doneCallback, errorResponse, errorMessage);
  }, TIMEOUT);

  it('error handler should handle "email" errors gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('email', errorMessage);
    handlesError(service.logout(), httpTestingController, doneCallback, errorResponse, errorMessage);
  }, TIMEOUT);

  it('error handler should handle "password_1" errors gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('password1', errorMessage);
    handlesError(service.logout(), httpTestingController, doneCallback, errorResponse, errorMessage);
  }, TIMEOUT);

  it('error handler should handle "password_2" errors gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('password2', errorMessage);
    handlesError(service.logout(), httpTestingController, doneCallback, errorResponse, errorMessage);
  }, TIMEOUT);

  it('login should have an error handler attached', doneCallback => {
    hasErrorHandler(service.login({} as ILoginRequest), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('logout should have an error handler attached', doneCallback => {
    hasErrorHandler(service.logout(), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('signup should have an error handler attached', doneCallback => {
    hasErrorHandler(service.signup({} as ISignupRequest), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('confirmEmail should have an error handler attached', doneCallback => {
    hasErrorHandler(service.confirmEmail({} as IConfirmEmailRequest), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('requestPasswordReset should have an error handler attached', doneCallback => {
    hasErrorHandler(service.requestPasswordReset({} as IPasswordResetRequest), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('confirmPasswordReset should have an error handler attached', doneCallback => {
    hasErrorHandler(service.confirmPasswordReset({} as IConfirmPasswordResetRequest), httpTestingController, doneCallback);
  }, TIMEOUT);

});



