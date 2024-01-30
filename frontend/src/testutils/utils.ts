import { HttpErrorResponse } from "@angular/common/http";
import { HttpTestingController } from "@angular/common/http/testing";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { SmartAuthoringBackendError } from "src/app/core/services/interfaces/errors.interface";

export function setHTMLInputValue(fixture : ComponentFixture<any>, id : string, value : string) : any {
  let field = getHTMLElement(fixture, id);
  field.value = value;
  field.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  return field;
}

export function getHTMLElement(fixture : ComponentFixture<any>, id : string) : any {
  return fixture.debugElement.query(By.css(id))?.nativeElement || null;
}

export function getAllHTMLElements(fixture : ComponentFixture<any>, selector : string) : any {
  return fixture.debugElement.queryAll(By.css(selector));
}

export function clickElement(fixture : ComponentFixture<any>, id : string) : any {
  let elem = fixture.debugElement.query(By.css(id)).nativeElement;
  elem.dispatchEvent(new Event('click'));
  fixture.detectChanges();
  return elem;
}

export function hasErrorHandler(result$: Observable<any>, httpTestingController: HttpTestingController, cb: any) {
  const errorResponse = new HttpErrorResponse( { status: 400, error: { unknownKey: 'some failure' } } );
    result$.subscribe(_ => _,
      error => { expect(error).toBeInstanceOf(SmartAuthoringBackendError); cb(); }
    );
    const testRequest = httpTestingController.expectOne(() => true);
    testRequest.flush(errorResponse.error, errorResponse);
};

export function handlesError(result$: Observable<any>, httpTestingController: HttpTestingController, cb: any, error: HttpErrorResponse, expectedMessage: string, expectedCode: number = 400) {
    result$.subscribe(_ => _,
      (error: SmartAuthoringBackendError) => { 
        expect(error.message).toEqual(expectedMessage); 
        expect(error.code).toEqual(expectedCode); 
        cb(); 
      }
    );
    const testRequest = httpTestingController.expectOne(() => true);
    testRequest.flush(error.error, error);
};

export function buildErrorMessage(field: string, message: string): HttpErrorResponse {
  let body: any = {};
  body[field] = [message];
  return new HttpErrorResponse( { status: 400, error: body });
}

export function spyOnSetter<SpiedOnType, PropType extends keyof SpiedOnType>
  (spyObj: jasmine.SpyObj<SpiedOnType>, prop: string): jasmine.Spy<(x: PropType) => void> {
  return (Object.getOwnPropertyDescriptor(spyObj, prop)?.set as jasmine.Spy<(v: PropType) => void>);
}

export function spyOnGetter<SpiedOnType, PropType>
  (spyObj: jasmine.SpyObj<SpiedOnType>, prop: string): jasmine.Spy<(x: PropType) => PropType> {
  return (Object.getOwnPropertyDescriptor(spyObj, prop)?.get as jasmine.Spy<() => PropType>);
}

