import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IQuestionnaire, IQuestionnaireBase } from 'src/app/core/models/questionnaire';
import { dummyQuestionnaire, dummyQuestionnaires, dummyQuestion, dummyQuestions } from 'src/testutils/object-mocks';
import { environment } from 'src/environments/environment';

import { QuestionService } from './question.service';
import { IQuestion, IQuestionBase } from 'src/app/core/models/question';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

describe('BackendQuestionService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some error';

  let service: QuestionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(QuestionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all questions', doneCallback => {
    service.getQuestions({ id: 1 } as IQuestionnaire).subscribe(
      questions => {
        expect(questions).toEqual(dummyQuestions);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questionnaires/1/questions`);
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyQuestions);

  }, TIMEOUT);

  it('should add a question', doneCallback => {
    const question: IQuestionBase = {
      title: 'dummyName',
      questionnaire: 1,
      text: '',
      asset: '',
      resourcetype: "ChoiceQuestion",
    };

    service.addQuestion(dummyQuestionnaire, question).subscribe(
      question => {
        expect(question).toEqual(dummyQuestion);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questionnaires/1/questions`);
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyQuestion);
  }, TIMEOUT);

  // we do not really modifiy?
  it('should modify a question', doneCallback => {
    let question: IQuestion = {
      id: 1,
      title: "<question 1 title>",
      asset: 'http://testServer.com/dummyQuestion.html',
      questionnaire: 1,
      text: '<question 1 description>',
      createdAt: "",
      createdBy: 0,
      resourcetype: "ChoiceQuestion",
      updatedAt: "",
      updatedBy: 0,
    };

    question.title = "";
    service.modifyQuestion(question).subscribe(
      dummyQuestion => {
        expect(dummyQuestion).toEqual(question);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController
      .expectOne(`${environment.apiUrl}/questions/${dummyQuestion.id}`);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(question);

  }, TIMEOUT);

  it('should update the question asset', doneCallback => {
    const data: Blob = new Blob(['someData'])
    service.updateQuestionAsset(dummyQuestion, { file: data }).subscribe(_ => doneCallback());

    const testRequest: TestRequest = httpTestingController.expectOne(dummyQuestion.asset);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush({});

  }, TIMEOUT);

  it('should delete a question', doneCallback => {
    service.deleteQuestion(dummyQuestion).subscribe(
      response => {
        expect(response).toEqual(new HttpResponse());
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questions/${dummyQuestion.id}`);
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(new HttpResponse());
  }, TIMEOUT);

  // Error handler test cases
  it('error handler should handle "unknown errors" gracefully', doneCallback => {
    const errorResponse: HttpErrorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getQuestions({ id: 1 } as IQuestionnaire), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  });

  it('getSlides should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getQuestions({ id: 1 } as IQuestionnaire), httpTestingController, doneCallback);
  });

  it('addSlide should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getQuestions({ id: 1 } as IQuestionnaire), httpTestingController, doneCallback);
  });

  it('modifySlide should have an error handler attached', doneCallback => {
    hasErrorHandler(service.modifyQuestion({ id: 1 } as IQuestion), httpTestingController, doneCallback);
  });

  it('deleteSlide should have an error handler attached', doneCallback => {
    hasErrorHandler(service.deleteQuestion({ id: 1 } as IQuestion), httpTestingController, doneCallback);
  });
});
