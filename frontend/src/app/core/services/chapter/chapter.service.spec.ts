import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IChapter, IChapterBase } from 'src/app/core/models/chapter';
import { ICourse } from 'src/app/core/models/course';
import { environment } from 'src/environments/environment';
import { dummyChapter, dummyChapters } from 'src/testutils/object-mocks';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';
import { ChapterService } from './chapter.service';


describe('ChapterService', () => {
  const TIMEOUT = 50;
  const errorMessage = 'some error';

  let service: ChapterService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(ChapterService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a sub chapter', doneCallback => {

    service.getChapter(dummyChapter.id).subscribe(
      course => {
        expect(course).toEqual(dummyChapter);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/chapters/${dummyChapter.id}`)
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyChapter);

  }, TIMEOUT);

  it('should retrieve all chapters', doneCallback => {

    service.getChapters({ id: 1 } as ICourse).subscribe(
      courses => {
        expect(courses).toEqual(dummyChapters);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/courses/1/chapters')
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyChapters);

  }, TIMEOUT);

  it('should add chapters', doneCallback => {
    let course: IChapterBase = {
      longDescription: 'test',
      shortDescription: 'test short',
      title: 'chapter'
    }

    service.addChapter({ id: 1 } as ICourse, course).subscribe(
      courses => {
        expect(courses).toEqual(dummyChapter);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/courses/1/chapters')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyChapter);

  }, TIMEOUT);

  it('should modify chapters', doneCallback => {
    service.modifyChapter(dummyChapter).subscribe(
      courses => {
        expect(courses).toEqual(dummyChapter);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/chapters/' + dummyChapter.id)
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(dummyChapter);

  }, TIMEOUT);

  it('should delete chapters', doneCallback => {
    let chapter: IChapter = {
      longDescription: 'test',
      shortDescription: 'test short',
      title: 'course name',
      id: 1,
      course: 1,
      order: 0,
    }

    service.deleteChapter(chapter).subscribe(
      courses => {
        expect(courses).toEqual(new HttpResponse());
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/chapters/' + chapter.id)
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(new HttpResponse());

  }, TIMEOUT);

  it('should get performance', doneCallback => {
    let chapter: IChapter = {
      longDescription: 'test',
      shortDescription: 'test short',
      title: 'course name',
      id: 1,
      course: 1,
      order: 0,
    }

    service.performanceChapter(chapter).subscribe(
      number => {
        expect(number).toEqual(-1);
        doneCallback();
      }
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/chapters/' + chapter.id + '/performance')
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(-1);

  }, TIMEOUT);

  // Error handler testcases
  it('error handler should handle "unknown" errors  gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getChapters({ id: 1 } as ICourse), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  }, TIMEOUT);

  it('getChapter should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getChapter(1), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('getChapters should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getChapters({ id: 1 } as ICourse), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('addChapter should have an error handler attached', doneCallback => {
    hasErrorHandler(service.addChapter({ id: 1 } as ICourse, {} as IChapterBase), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('modifyChapter should have an error handler attached', doneCallback => {
    hasErrorHandler(service.modifyChapter({ id: 1 } as IChapter), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('deleteChapter should have an error handler attached', doneCallback => {
    hasErrorHandler(service.deleteChapter({ id: 1 } as IChapter), httpTestingController, doneCallback);
  }, TIMEOUT);


});


