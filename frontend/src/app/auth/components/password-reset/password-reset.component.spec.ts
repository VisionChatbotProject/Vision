import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMessageType, ERedirect, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { of, throwError } from 'rxjs';
import { IConfirmPasswordResetRequest } from 'src/app/core/models/auth';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';
import { createRouterSpy, IRouterSpy } from 'src/testutils/built-in-mocks';
import { authoringApiServiceMock, messageServiceMock } from 'src/testutils/service-mocks';

import { PasswordResetComponent } from './password-reset.component';

@Component({
  selector: 'smart-study-password-reset',
  template: ''
})
class PasswordResetComponentMock {
};

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordResetComponent, PasswordResetComponentMock],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
      ]
    }).overrideComponent(PasswordResetComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceMock },
        ]
      }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetComponent);
    activatedRoute = TestBed.inject(ActivatedRoute)
    router = TestBed.inject(Router)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to "login" if requested', () => {  
    let routerSpy = spyOn(router, 'navigate');
    component.performRedirect(ERedirect.eRedirectLogin);
    expect(routerSpy).toHaveBeenCalledWith(['../login']);
  });

  it('should confirm password reset if requested', () => {
    const message: string = 'Some Message';
    authoringApiServiceMock.authService.confirmPasswordReset.and.returnValue(of({ 'detail': message }));
    spyOn(activatedRoute.snapshot.queryParamMap, 'get')
      .withArgs('uid').and.returnValue('1')   
      .withArgs('token').and.returnValue('someToken')
    
      component.performReset({ password: 'abc', passwordRepeat: 'abc' });
    
      let payload: IConfirmPasswordResetRequest = {
        uid: '1',
        token: 'someToken',
        new_password1: 'abc',
        new_password2: 'abc'
      };

      expect(authoringApiServiceMock.authService.confirmPasswordReset).toHaveBeenCalledWith(payload);
      expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eSuccess, text: message });
  });

  it('should display an error if password reset fails', () => {
    const errorMessage: string = 'some error';
    const errorResponse = new SmartAuthoringBackendError(400, errorMessage);

    authoringApiServiceMock.authService.confirmPasswordReset.and.callFake(() => { return throwError(errorResponse) });
    spyOn(activatedRoute.snapshot.queryParamMap, 'get')
      .withArgs('uid').and.returnValue('1')   
      .withArgs('token').and.returnValue('someToken')
    
      component.performReset({ password: 'abc', passwordRepeat: 'abc' });
    
      let payload: IConfirmPasswordResetRequest = {
        uid: '1',
        token: 'someToken',
        new_password1: 'abc',
        new_password2: 'abc'
      };

      expect(authoringApiServiceMock.authService.confirmPasswordReset).toHaveBeenCalledWith(payload);
      expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eError, text: errorMessage });
  });

  it('should display an error if the given link is broken', () => {
    const errorMessage: string = 'some error';
    const errorResponse = new SmartAuthoringBackendError(400, errorMessage);

    spyOn(activatedRoute.snapshot.queryParamMap, 'get')
      .withArgs('uid').and.returnValue('1')   
      .withArgs('token').and.returnValue(null)
    
      component.performReset({ password: 'abc', passwordRepeat: 'abc' });
    
      expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eError, text: component['_invalid_link_error'] });
  });

});
