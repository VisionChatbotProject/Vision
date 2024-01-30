import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IAsset } from 'src/app/core/models/base';
import { IChapter } from 'src/app/core/models/chapter';
import { ISlide, ISlideBase } from 'src/app/core/models/slide';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';

@Injectable({
  providedIn: 'root'
})
export class SlideService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieve all slides for a given chapter.
   * 
   * @param chapter {@link IChapter} the chapter for which to retrieve all slides
   * @returns an {@link Observable} of type {@link ISlide}[] with all slides
   */
  public getSlides(chapter: IChapter): Observable<ISlide[]> {
    return this._httpClient.get<ISlide[]>(`${environment.apiUrl}/chapters/${chapter.id}/slides`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Add a slide to a given chapter.
   * 
   * @param chapter {@link IChapter} the chapter to which to add the slide
   * @param slide {@link ISlideBase} the slide to add.
   * @returns an {@link Observable} of type {@link ISlide} with the new slide
  */
  public addSlide(chapter: IChapter, slide: ISlideBase): Observable<ISlide> {
    return this._httpClient.post<ISlide>(`${environment.apiUrl}/chapters/${chapter.id}/slides`, slide).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Modify a slide
   * 
   * @param slide {@link ISlide} the slide to modify
   * @returns an {@link Observable} of type {@link ISlide} with the modified slide
   */
  public modifySlide(slide: ISlide): Observable<ISlide> {
    return this._httpClient.put<ISlide>(`${environment.apiUrl}/slides/${slide.id}`, slide).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Update a slides content
   * 
   * @param slide {@link ISlide} the slide to modify
   * @param content {@link IAsset} containing the data
   * @returns an {@link Observable} an empty HTTPResponse 
   */
  public updateSlideContent(slide: ISlide, content: IAsset): Observable<HttpResponse<void>> {
    const formData = new FormData();
    (Object.keys(content) as Array<keyof IAsset>).forEach(key => formData.set(key, content[key]));
    return this._httpClient.put<HttpResponse<void>>(slide.content, formData).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Delete a slide
   * 
   * @param slide {@link ISlide} the slide to delete
   * @returns an {@link Observable} containing an empty response.
   */
  public deleteSlide(slide: ISlide): Observable<HttpResponse<null>> {
    return this._httpClient.delete<ISlide>(`${environment.apiUrl}/slides/${slide.id}`).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }
}
