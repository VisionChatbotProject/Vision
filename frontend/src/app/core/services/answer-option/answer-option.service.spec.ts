import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { dummyAnswerOption, dummyAnswerOptions, dummyQuestion } from 'src/testutils/object-mocks';
import { environment } from 'src/environments/environment';
import { AnswerOptionService } from './answer-option.service';
import { IQuestion } from 'src/app/core/models/question';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';
import { IAnswerOption, IAnswerOptionBase } from 'src/app/core/models/answer_options';

describe('BackendAnwserOptionService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some error';

  let service: AnswerOptionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AnswerOptionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all answer options', doneCallback => {
    service.getAnswerOptions({ id: 1 } as IQuestion).subscribe(
      questions => {
        expect(questions).toEqual(dummyAnswerOptions);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questions/1/answeroptions`);
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyAnswerOptions);

  }, TIMEOUT);

  it('should add a answer option', doneCallback => {
    const answerOption: IAnswerOptionBase = {
      text: '<answer option 1 description>',
      resourcetype: 'AnswerOption',
      asset: 'http://testServer.com/dummyAnswerOption.html',
      correctAnswer: true,
    };

    service.addAnswerOption(dummyQuestion, answerOption).subscribe(
      answerOption => {
        expect(answerOption).toEqual(dummyAnswerOption);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/questions/1/answeroptions`);
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyAnswerOption);
  }, TIMEOUT);

  it('should modify a answer option', doneCallback => {
    let answerOption: IAnswerOption = {
      id: 1,
      asset: 'http://testServer.com/dummyAnswerOption.html',
      question: 1,
      resourcetype: 'AnswerOption',
      text: '',
      createdAt: "",
      createdBy: 0,
      updatedAt: "",
      updatedBy: 0,
      correctAnswer: false,
    };

    answerOption.text = ''
    service.modifyAnswerOption(answerOption).subscribe(
      dummyAnswerOption => {
        expect(dummyAnswerOption).toEqual(answerOption);
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController
      .expectOne(`${environment.apiUrl}/answeroptions/${dummyAnswerOption.id}`);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(answerOption);

  }, TIMEOUT);

  it('should update the answer option asset', doneCallback => {
    const data: Blob = new Blob(['someData'])
    service.updateAnswerOptionAsset(dummyAnswerOption, { file: data }).subscribe(_ => doneCallback());

    const testRequest: TestRequest = httpTestingController.expectOne(dummyAnswerOption.asset);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush({});

  }, TIMEOUT);

  it('should delete a answer option', doneCallback => {
    service.deleteAnswerOption(dummyAnswerOption).subscribe(
      response => {
        expect(response).toEqual(new HttpResponse());
        doneCallback();
      });

    const testRequest: TestRequest = httpTestingController.expectOne(`${environment.apiUrl}/answeroptions/${dummyAnswerOption.id}`);
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(new HttpResponse());
  }, TIMEOUT);

  // Error handler test cases
  it('error handler should handle "unknown errors" gracefully', doneCallback => {
    const errorResponse: HttpErrorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getAnswerOptions({ id: 1 } as IQuestion), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  });
});
