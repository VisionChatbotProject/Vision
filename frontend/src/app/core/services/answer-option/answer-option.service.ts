import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAsset } from 'src/app/core/models/base';
import { IAnswerOption, IAnswerOptionBase } from 'src/app/core/models/answer_options';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';
import { IQuestion, IQuestionBase } from 'src/app/core/models/question';

@Injectable({
  providedIn: 'root'
})
export class AnswerOptionService {

  constructor(
    private _httpClient: HttpClient
  ) { }
  
  /**
   * Retrieve all answer options for a given question.
   * 
   * @param anwserOption {@link IAnswerOption} the question for which to retrieve all answer options
   * @returns an {@link Observable} of type {@link IAnswerOption}[] with all answer options
   */
  getAnswerOptions(question: IQuestion): Observable<IAnswerOption[]> {
    return this._httpClient.get<IAnswerOption[]>(`${environment.apiUrl}/questions/${question.id}/answeroptions`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Add a answer option to a given question.
   * 
   * @param answerOption {@link IAnswerOption} the question to which to add the answer option
   * @param question {@link IAnswerOption} the question to add.
   * @returns an {@link Observable} of type {@link IAnswerOption} with the new answer option
  */
  addAnswerOption(question: IQuestion, answerOption: IAnswerOptionBase): Observable<IAnswerOption> {
    return this._httpClient.post<IAnswerOption>(`${environment.apiUrl}/questions/${question.id}/answeroptions`, answerOption).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Modify a answer option
   * 
   * @param answerOption {@link IAnswerOption} the anwser option to modify
   * @returns an {@link Observable} of type {@link IAnswerOption} with the modified answer option
   */
  modifyAnswerOption(answerOption: IAnswerOption): Observable<IAnswerOption> {
    return this._httpClient.put<IAnswerOption>(`${environment.apiUrl}/answeroptions/${answerOption.id}`, answerOption).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Delete a answer option
   * 
   * @param answerOption {@link IAnswerOption} the anwser option to delete
   * @returns an {@link Observable} containing an empty response.
   */
  deleteAnswerOption(answerOption: IAnswerOption): Observable<HttpResponse<null>> {
    return this._httpClient.delete<IAnswerOption>(`${environment.apiUrl}/answeroptions/${answerOption.id}`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Update a answer option asset
   * 
   * @param answerOption {@link IAnswerOption} the anwser option to modify
   * @param asset {@link IAsset} containing the data
   * @returns an {@link Observable} an empty HTTPResponse 
   */
  updateAnswerOptionAsset(answerOption: IAnswerOption, asset: IAsset): Observable<HttpResponse<void>> {
    const formData = new FormData();
    (Object.keys(asset) as Array<keyof IAsset>).forEach(key => formData.set(key, asset[key]));
    return this._httpClient.put<HttpResponse<void>>(answerOption.asset, formData).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }
}