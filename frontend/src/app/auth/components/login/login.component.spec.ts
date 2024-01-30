import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMessageType, ERedirect, MessageService } from '@smart-study-graz/ngx-smartstudy-auth';
import { of, throwError } from 'rxjs';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { SmartAuthoringBackendError } from 'src/app/core/services/interfaces/errors.interface';
import { authoringApiServiceMock, messageServiceMock } from 'src/testutils/service-mocks';

import { LoginComponent } from './login.component';

@Component({
  selector: 'smart-study-login',
  template: ''
})
class LoginComponentMock {
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, LoginComponentMock],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
      ]
    }).overrideComponent(LoginComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceMock },
        ]
      }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should login and redirect', () => {
    fixture.detectChanges();

    let routerSpy = spyOn(router, 'navigate');
    authoringApiServiceMock.authService.login.and.returnValue(of({'key': 'abc' }));
  
    component.login({ password: 'abc', email: 'abc@def.com' });

    expect(routerSpy).toHaveBeenCalledWith(['main/dashboard']);
    expect(authoringApiServiceMock.authService.login).toHaveBeenCalled();
  });

  it('should handle error if login not possible',  () => {
    fixture.detectChanges();

    let routerSpy = spyOn(router, 'navigate');
    const errorMessage: string = 'some error';
    const errorResponse = new SmartAuthoringBackendError(400, errorMessage);
    authoringApiServiceMock.authService.login.and.callFake(() => { return throwError(errorResponse) });
    
    component.login({email: 'a@b.com', password: 'abc'});

    expect(routerSpy).toHaveBeenCalledTimes(0);
    expect(authoringApiServiceMock.authService.login).toHaveBeenCalled();
    fixture.detectChanges(); // To make sure the observable has fired
    expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eError, text: errorMessage });
  });

  it('should confirm the email if key is passed', () => {
    let routeSpy = spyOn(activatedRoute.snapshot.queryParamMap, 'get').withArgs('key').and.returnValue('abc');
    authoringApiServiceMock.authService.confirmEmail.and.callFake(() => { return of({ detail : 'ok' }) });

    fixture.detectChanges();

    expect(routeSpy).toHaveBeenCalled();
    expect(messageServiceMock.showMessage).toHaveBeenCalledWith({ type: EMessageType.eSuccess, text: component['_verification_success_message'] });
  })

  it('should redirect to "signup" if requested', () => {
    fixture.detectChanges();

    let routerSpy = spyOn(router, 'navigate');   
    component.performRedirect(ERedirect.eRedirectSignup);
    expect(routerSpy).toHaveBeenCalledWith(['../signup']);
  });

  it('should redirect to "request password reset" if requested', () => {   
    fixture.detectChanges();

    let routerSpy = spyOn(router, 'navigate');   
    component.performRedirect(ERedirect.eRedirectForgotPassword);
    expect(routerSpy).toHaveBeenCalledWith(['../requestPasswordReset']);
  });

});
