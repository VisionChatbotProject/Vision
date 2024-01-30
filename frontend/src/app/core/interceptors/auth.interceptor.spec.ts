import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const url: string = 'http://api.test.at/someEndpoint';
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [
          AuthInterceptor,
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
          },
        ],
        imports: [HttpClientTestingModule]
      });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should intercept GET requests and add an authorization header', () => {
    httpClient.get<any>(url).subscribe(data => true);
    const httpRequest = httpTestingController.expectOne(url);
    expect(httpRequest.request.withCredentials).toBe(true);
  });

  it('should intercept POST requests and add an authorization header', () => {
    httpClient.post<any>(url, {}).subscribe(data => true);
    const httpRequest = httpTestingController.expectOne(url);
    expect(httpRequest.request.withCredentials).toBe(true);
  });

  it('should intercept PUT requests and add an authorization header', () => {
    httpClient.put<any>(url, {}).subscribe(data => true);
    const httpRequest = httpTestingController.expectOne(url);
    expect(httpRequest.request.withCredentials).toBe(true);
  });

  it('should intercept PATCH requests and add an authorization header', () => {
    httpClient.patch<any>(url, {}).subscribe(data => true);
    const httpRequest = httpTestingController.expectOne(url);
    expect(httpRequest.request.withCredentials).toBe(true);
  });

  it('should intercept DELETE requests and add an authorization header', () => {
    httpClient.delete<any>(url).subscribe(data => true);
    const httpRequest = httpTestingController.expectOne(url);
    expect(httpRequest.request.withCredentials).toBe(true);
  });
});
