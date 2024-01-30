import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IChapter } from 'src/app/core/models/chapter';
import { ISlide, ISlideBase } from 'src/app/core/models/slide';
import { environment } from 'src/environments/environment';
import { dummyChapter, dummySlide, dummySlides } from 'src/testutils/object-mocks';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';
import { SlideService } from './slide.service';


describe('BackendSlideService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some error';

  let service: SlideService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(SlideService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all slides', doneCallback => {
    service.getSlides({ id: 1 } as IChapter).subscribe(
      slides => {
        expect(slides).toEqual(dummySlides);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/chapters/1/slides`);
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummySlides);

  }, TIMEOUT);

  it('should add a slide', doneCallback => {
    const slide: ISlideBase = {
      title: 'dummyName',
      content: '<p>some Content</p>'
    };

    service.addSlide(dummyChapter, slide).subscribe(
      slide => {
        expect(slide).toEqual(dummySlide);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/chapters/1/slides`);
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummySlide);
  }, TIMEOUT);

  it('should modify a slide', doneCallback => {
    service.modifySlide(dummySlide).subscribe(
      dummySlide => {
        expect(dummySlide).toEqual(dummySlide);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController
      .expectOne(`${environment.apiUrl}/slides/${dummySlide.id}`);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(dummySlide);

  }, TIMEOUT);

  it('should update the slide content', doneCallback => {
    const data: Blob = new Blob(['someData'])
    service.updateSlideContent(dummySlide, { file: data }).subscribe(_ => doneCallback());

    const testRequest: TestRequest = httpTestingController.expectOne(dummySlide.content);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush({});

  }, TIMEOUT);

  it('should delete a slide', doneCallback => {
    const slide: ISlide = {
      id: 1,
      title: 'dummyName',
      content: '<p>some Content</p>',
      order: 0
    };

    service.deleteSlide(slide).subscribe(
      response => {
        expect(response).toEqual(new HttpResponse());
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/slides/${slide.id}`);
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(new HttpResponse());
  }, TIMEOUT);

  // Error handler test cases
  it('error handler should handle "unknown errors" gracefully', doneCallback => {
    const errorResponse: HttpErrorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getSlides({ id: 1 } as IChapter), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  });

  it('getSlides should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getSlides({ id: 1 } as IChapter), httpTestingController, doneCallback);
  });

  it('addSlide should have an error handler attached', doneCallback => {
    hasErrorHandler(service.addSlide({ id: 1 } as IChapter, {} as ISlideBase), httpTestingController, doneCallback);
  });

  it('modifySlide should have an error handler attached', doneCallback => {
    hasErrorHandler(service.modifySlide({ id: 1 } as ISlide), httpTestingController, doneCallback);
  });

  it('deleteSlide should have an error handler attached', doneCallback => {
    hasErrorHandler(service.deleteSlide({ id: 1 } as ISlide), httpTestingController, doneCallback);
  });
});
