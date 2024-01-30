import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAsset } from 'src/app/core/models/base';
import { IQuestionnaire } from 'src/app/core/models/questionnaire';
import { IQuestion, IQuestionBase } from 'src/app/core/models/question';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieve all questions for a given questionnaire.
   * 
   * @param questionnaire {@link IQuestionnaire} the questionnaire for which to retrieve all questions
   * @returns an {@link Observable} of type {@link IQuestion}[] with all questions
   */
  getQuestions(questionnaire: IQuestionnaire): Observable<IQuestion[]> {
    return this._httpClient.get<IQuestion[]>(`${environment.apiUrl}/questionnaires/${questionnaire.id}/questions`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Add a question to a given questionnaire.
   * 
   * @param questionnaire {@link IQuestionnaire} the questionnaire to which to add the question
   * @param question {@link IQuestion} the question to add.
   * @returns an {@link Observable} of type {@link IQuestion} with the new question
  */
  addQuestion(questionnaire: IQuestionnaire, question: IQuestionBase): Observable<IQuestion> {
    return this._httpClient.post<IQuestionnaire>(`${environment.apiUrl}/questionnaires/${questionnaire.id}/questions`, question).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Modify a question
   * 
   * @param question {@link IQuestion} the question to modify
   * @returns an {@link Observable} of type {@link IQuestion} with the modified question
   */
  modifyQuestion(question: IQuestion): Observable<IQuestion> {
    return this._httpClient.put<IQuestionnaire>(`${environment.apiUrl}/questions/${question.id}`, question).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Delete a question
   * 
   * @param question {@link IQuestion} the question to delete
   * @returns an {@link Observable} containing an empty response.
   */
  deleteQuestion(question: IQuestion): Observable<HttpResponse<null>> {
    return this._httpClient.delete<IQuestion>(`${environment.apiUrl}/questions/${question.id}`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Update a question asset
   * 
   * @param question {@link IQuestion} the question to modify
   * @param asset {@link IAsset} containing the data
   * @returns an {@link Observable} an empty HTTPResponse 
   */
  updateQuestionAsset(question: IQuestion, asset: IAsset): Observable<HttpResponse<void>> {
    const formData = new FormData();
    (Object.keys(asset) as Array<keyof IAsset>).forEach(key => formData.set(key, asset[key]));
    return this._httpClient.put<HttpResponse<void>>(question.asset, formData).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }
}