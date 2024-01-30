import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { IChapter, IChapterBase } from 'src/app/core/models/chapter';
import { ICourse } from 'src/app/core/models/course';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';
import { ToastService } from '../toast/toast.service';
import { ToastStrings } from '../../models/toast-event';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  constructor(
    private _httpClient: HttpClient,
    private _toastService: ToastService
  ) { }

  /**
   * Retrieves a chapter for the given id
   * 
   * @param id - The id for which to retrieve the chapter
   * @returns An {@link Observable} with the retrieved {@link IChapter}
   */
  public getChapter(id: number): Observable<IChapter> {
    return this._httpClient.get<IChapter[]>(`${environment.apiUrl}/chapters/${id}`).pipe(
      catchError((err, _) => this._errorHandler(err))
    );
  }

  /**
   * Retrieve all chapters for a given course.
   * 
   * @param course {@link ICourse} the course for which to retrieve chapters
   * @returns an {@link Observable} of type {@link IChapter}[] with all chapters
   */
  public getChapters(course: ICourse): Observable<IChapter[]> {
    return this._httpClient.get<IChapter[]>(`${environment.apiUrl}/courses/${course.id}/chapters`).pipe(
      catchError((err, _) => this._errorHandler(err))
    );
  }

  /**
   * Add a chapter to a given course
   * 
   * @param course {@link ICourse} the course for which to add the chapter
   * @param chapter {@link IChapterBase} the chapter to add
   * @returns an {@link Observable} of type {@link IChapter} with the new chapter
   */
  public addChapter(course: ICourse, chapter: IChapterBase): Observable<IChapter> {
    return this._httpClient.post<IChapter>(`${environment.apiUrl}/courses/${course.id}/chapters`, chapter).pipe(
      catchError((err, _) => this._errorHandler(err))
    );
  }

  /**
   * Modify a chapter 
   * 
   * @param chapter {@link IChapter} the chapter to modify
   * @returns an {@link Observable} of type {@link IChapter} with the modified chapter
   */
  public modifyChapter(chapter: IChapter): Observable<IChapter> {
    return this._httpClient.put<IChapter>(`${environment.apiUrl}/chapters/${chapter.id}`, chapter).pipe(
      catchError((err, _) => this._errorHandler(err))
    );
  }

  /**
   * Delete a chapter 
   * 
   * @param chapter {@link IChapter} the chapter to delete
   * @returns an {@link Observable} containing an empty response.
   */
  public deleteChapter(chapter: IChapter): Observable<HttpResponse<null>> {
    return this._httpClient.delete<IChapter>(`${environment.apiUrl}/chapters/${chapter.id}`).pipe(
      catchError((err, _) => this._errorHandler(err))
    );
  }

  /**
   * Performance of a chapter 
   * 
   * @param chapter {@link IChapter} the chapter to get
   * @returns an {@link number} containing the .
   */
  public performanceChapter(chapter: IChapter): Observable<Number> {
    return this._httpClient.get<Number>(`${environment.apiUrl}/chapters/${chapter.id}/performance`)
      .pipe(
        catchError(this._handleError<number>(-1))
      );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    this._toastService.showErrorToast(ToastStrings.error_header,  e.message)
    return throwError(new SmartAuthoringBackendError(e.status, ErrorMessages.unknown_error));
  }

  /**
   * Handle Http operation that failed. Let the app continue an return a result.
   * see https://angular.io/tutorial/tour-of-heroes/toh-pt6
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private _handleError<T>(result?: T) {
    return (e: any): Observable<T> => {

      this._toastService.showErrorToast(ToastStrings.error_header, e.message)
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
