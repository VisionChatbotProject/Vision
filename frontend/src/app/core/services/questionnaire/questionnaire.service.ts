import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICourse } from 'src/app/core/models/course';
import { IQuestionnaire, IQuestionnaireBase } from 'src/app/core/models/questionnaire';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieves an questionnaire for the given id
   * 
   * @param id - The id for which to retrieve the questionnaire
   * @returns An {@link Observable} with the retrieved {@link IQuestionnaire}
   */
  public getQuestionnaire(id: number): Observable<IQuestionnaire> {
    return this._httpClient.get<IQuestionnaire>(`${environment.apiUrl}/questionnaires/${id}`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Retrieve all questionnaires for a given course.
   * 
   * @param course {@link ICourse} the course for which to retrieve all questionnaires
   * @returns an {@link Observable} of type {@link IQuestionnaire}[] with all questionnaires
   */
  public getQuestionnaires(course: ICourse): Observable<IQuestionnaire[]> {
    return this._httpClient.get<IQuestionnaire[]>(`${environment.apiUrl}/courses/${course.id}/questionnaires`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Add an questionnaire to a given course
   * 
   * @param course {@link ICourse} the course for which to add the questionnaire
   * @param questionnaire {@link IQuestionnaireBase} the questionnaire to add
   * @returns an {@link Observable} of type {@link IQuestionnaire} with the new questionnaire
   */
  public addQuestionnaire(course: ICourse, questionnaire: IQuestionnaireBase): Observable<IQuestionnaire> {
    return this._httpClient.post<IQuestionnaire>(`${environment.apiUrl}/courses/${course.id}/questionnaires`, questionnaire).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Modify an questionnaire 
   * 
   * @param questionnaire {@link IQuestionnaire} the questionnaire to modify
   * @returns an {@link Observable} of type {@link IQuestionnaire} with the modified questionnaire
   */
  public modifyQuestionnaire(questionnaire: IQuestionnaire): Observable<IQuestionnaire> {
    return this._httpClient.put<IQuestionnaire>(`${environment.apiUrl}/questionnaires/${questionnaire.id}`, questionnaire).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Delete an questionnaire 
   * 
   * @param questionnaire {@link IQuestionnaire} the questionnaire to delete
   * @returns an {@link Observable} containing an empty response.
   */
  public deleteQuestionnaire(questionnaire: IQuestionnaire): Observable<HttpResponse<null>> {
    return this._httpClient.delete<IQuestionnaire>(`${environment.apiUrl}/questionnaires/${questionnaire.id}`).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }

}
