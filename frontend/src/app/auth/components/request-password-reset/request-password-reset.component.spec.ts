import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMessageType, ERedirect, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { of, throwError } from 'rxjs';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';
import { createRouterSpy, IRouterSpy } from 'src/testutils/built-in-mocks';
import { authoringApiServiceMock, messageServiceMock } from 'src/testutils/service-mocks';

import { RequestPasswordResetComponent } from './request-password-reset.component';

@Component({
  selector: 'smart-study-request-password-reset',
  template: ''
})
class RequestPasswordResetComponentMock {
}

describe('RequestPasswordResetComponent', () => {
  let component: RequestPasswordResetComponent;
  let fixture: ComponentFixture<RequestPasswordResetComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestPasswordResetComponent, RequestPasswordResetComponentMock],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
      ],
    }).overrideComponent(RequestPasswordResetComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceMock },
        ]
      }
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error if request password is not possible', () => {
    const errorMessage: string = 'some error';
    const errorResponse = new SmartAuthoringBackendError(400, errorMessage);
    authoringApiServiceMock.authService.requestPasswordReset.and.callFake(() => { return throwError(errorResponse)});
    component.requestPasswordReset({ email: 'a@b.com' });

    expect(authoringApiServiceMock.authService.requestPasswordReset).toHaveBeenCalled();
    expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eError, text: errorMessage });
  });

  it('should request password reset and not redirect',  waitForAsync(() => {
    const successMessage: string = 'Some Message';
    let routerSpy = spyOn(router, 'navigate');
    authoringApiServiceMock.authService.requestPasswordReset.and.returnValue(of({'detail': successMessage }));

    fixture.whenStable().then(() => {
      component.requestPasswordReset({ email: 'abc@def.com' });

      expect(routerSpy).toHaveBeenCalledTimes(0);
      expect(authoringApiServiceMock.authService.requestPasswordReset).toHaveBeenCalled();
      fixture.detectChanges(); // To make sure the observable has fired
      expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eSuccess, text: successMessage });
    });
  }));

  it('should redirect to "login" if requested', () => {   
    let routerSpy = spyOn(router, 'navigate');
    component.performRedirect(ERedirect.eRedirectLogin);
    expect(routerSpy).toHaveBeenCalledWith(['../login']);
  });

});
