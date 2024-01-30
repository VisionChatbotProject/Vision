import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ICourse } from 'src/app/core/models/course';
import { IQuestionnaire, IQuestionnaireBase } from 'src/app/core/models/questionnaire';
import { environment } from 'src/environments/environment';
import { dummyCourse, dummyQuestionnaire, dummyQuestionnaires } from 'src/testutils/object-mocks';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';

import { QuestionnaireService } from './questionnaire.service';

describe('BackendQuestionnaireService', () => {
  const TIMEOUT = 50;
  const errorMessage = 'some error';

  let service: QuestionnaireService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(QuestionnaireService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve an questionnaire', doneCallback => {

    service.getQuestionnaire(dummyQuestionnaire.id).subscribe(
      questionnaire => {
        expect(questionnaire).toEqual(dummyQuestionnaire);
        doneCallback();
      }
    );

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questionnaires/${dummyQuestionnaire.id}`)
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyQuestionnaire);

  }, TIMEOUT);

  it('should retrieve all questionnaires', doneCallback => {
    service.getQuestionnaires({ id: dummyCourse.id } as ICourse).subscribe(
      questionnaires => {
        expect(questionnaires).toEqual(dummyQuestionnaires);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/questionnaires`);
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyQuestionnaires);

  }, TIMEOUT);

  it('should add an questionnaire', doneCallback => {
    let new_questionnaire: IQuestionnaireBase = { title: 'Questionnaire' }

    service.addQuestionnaire({ id: dummyCourse.id } as ICourse, new_questionnaire).subscribe(
      questionnaire => {
        expect(questionnaire).toEqual(dummyQuestionnaire);
        doneCallback();
      }
    );

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/courses/${dummyCourse.id}/questionnaires`)
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyQuestionnaire);

  }, TIMEOUT);

  it('should modify an questionnaire', doneCallback => {
    service.modifyQuestionnaire(dummyQuestionnaire).subscribe(
      questionnaire => {
        expect(questionnaire).toEqual(dummyQuestionnaire);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questionnaires/${dummyQuestionnaire.id}`);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(dummyQuestionnaire);

  }, TIMEOUT);

  it('should delete an questionnaire', doneCallback => {
    const questionnaire: IQuestionnaire = {
      id: 12,
      course: 1,
      title: 'Questionnaire'
    };

    service.deleteQuestionnaire(questionnaire).subscribe(
      response => {
        expect(response).toEqual(new HttpResponse());
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questionnaires/${questionnaire.id}`);
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(new HttpResponse());
  }, TIMEOUT);

  // Error handler testcases
  it('error handler should handle "unknown" errors  gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getQuestionnaires({ id: 1 } as ICourse), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  }, TIMEOUT);

  it('getQuestionnaire should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getQuestionnaire(1), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('getQuestionnaires should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getQuestionnaires({ id: 1 } as ICourse), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('addQuestionnaire should have an error handler attached', doneCallback => {
    hasErrorHandler(service.addQuestionnaire({ id: 1 } as ICourse, {} as IQuestionnaireBase), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('modifyQuestionnaire should have an error handler attached', doneCallback => {
    hasErrorHandler(service.modifyQuestionnaire({ id: 1 } as IQuestionnaire), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('deleteQuestionnaire should have an error handler attached', doneCallback => {
    hasErrorHandler(service.deleteQuestionnaire({ id: 1 } as IQuestionnaire), httpTestingController, doneCallback);
  }, TIMEOUT);

});
