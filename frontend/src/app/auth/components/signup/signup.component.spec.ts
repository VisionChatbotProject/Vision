import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMessageType, ERedirect, ISignupData, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { of, throwError } from 'rxjs';
import { ISignupRequest } from 'src/app/core/models/auth';
import { IBackendMessage } from 'src/app/core/models/base';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';
import { createRouterSpy, IRouterSpy } from 'src/testutils/built-in-mocks';
import { dummyInvites } from 'src/testutils/object-mocks';
import { authoringApiServiceMock, messageServiceMock } from 'src/testutils/service-mocks';

import { SignupComponent } from './signup.component';

@Component({
  selector: 'smart-study-signup',
  template: ''
})
class SignupComponentMock {
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {    
    await TestBed.configureTestingModule({
      declarations: [SignupComponent, SignupComponentMock],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
      ],
      imports: [RouterTestingModule]

    }).overrideComponent(SignupComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceMock },
        ]
      }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "signup"', () => {
    let successResponse: IBackendMessage = { detail: 'Signup succeeded' };
    authoringApiServiceMock.authService.signup.and.returnValue(of(successResponse));
    
    let formData: ISignupData = {
      email: 'test@mail.com',
      password: 'securePassword',
      passwordConfirm: 'securePassword',
      firstName: 'FirstName',
      lastName: 'LastName',
      prenominalTitle: '',
      postnominalTitle: '',
      inviteCode: '',
    }
    
    component.signup(formData);
    
    expect(authoringApiServiceMock.authService.signup).toHaveBeenCalled();

    fixture.detectChanges(); // To make sure the observable has fired
    expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eSuccess, text: successResponse.detail })
  });

  it('should call "signup" redeem code routine', () => {
    let routerSpy = spyOn(router, 'navigate');
    authoringApiServiceMock.authService.redeem.and.returnValue(of(dummyInvites[0]));

    spyOn(activatedRoute.snapshot.queryParamMap, 'get')
      .withArgs('code').and.returnValue('XYZ12')

      let code: string = 'XYZ12'

      let formData: ISignupData = {
        email: 'john-doe@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'test12300',
        passwordConfirm: 'test12300',
        inviteCode: code
      }

      let requestData: ISignupRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password1: formData.password,
        password2: formData.passwordConfirm
      }

      component.signup(formData);

      expect(authoringApiServiceMock.authService.redeem).toHaveBeenCalledWith(requestData, code);
      expect(routerSpy).toHaveBeenCalledWith(['../login']);
  });

  it('should handle errors caused by "signup"',  () => {
    const error: string = 'some error';
    const errorResponse = new SmartAuthoringBackendError(400, error);
    authoringApiServiceMock.authService.signup.and.callFake(() => { return throwError(errorResponse)});
    
    let formData: ISignupData = {
      email: 'test@mail.com',
      password: 'securePassword',
      passwordConfirm: 'securePassword',
      firstName: 'FirstName',
      lastName: 'LastName',
      prenominalTitle: '',
      postnominalTitle: '',
      inviteCode: '',
    };

    component.signup(formData);

    expect(authoringApiServiceMock.authService.signup).toHaveBeenCalled();
    fixture.detectChanges(); // To make sure the observable has fired
    
    expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eError, text: error });
  });

  it('should handle errors caused by "signup" redeem routine',  () => {
    const errorMessage: string = 'some error';
    const errorResponse = new SmartAuthoringBackendError(400, errorMessage);

    authoringApiServiceMock.authService.redeem.and.callFake(() => { return throwError(errorResponse) });
    spyOn(activatedRoute.snapshot.queryParamMap, 'get')
      .withArgs('code').and.returnValue('XYZ12')   
    
      let code: string = 'XYZ12'

      let formData: ISignupData = {
        email: 'john-doe@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'test12300',
        passwordConfirm: 'test12300',
        inviteCode: code
      }

      let requestData: ISignupRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password1: formData.password,
        password2: formData.passwordConfirm
      }

      component.signup(formData);

      expect(authoringApiServiceMock.authService.redeem).toHaveBeenCalledWith(requestData, code);
      expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eError, text: errorMessage });
  });

  it('should redirect to "login" if requested', () => {  
    let navigateSpy = spyOn(router, 'navigate');

    component.performRedirect(ERedirect.eRedirectLogin);
    expect(navigateSpy).toHaveBeenCalledWith(['../login']);
  });

});
