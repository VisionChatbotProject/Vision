import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Observable, throwError } from "rxjs";
import { catchError, switchMap, tap, toArray } from "rxjs/operators";
import { IAsset, IAssetSource } from "src/app/core/models/base";
import { ICourse, ICourseBase } from "src/app/core/models/course";
import { IOrganization } from "src/app/core/models/organization";
import { IIntent } from "src/app/intent/models/intent.model";
import { environment } from "src/environments/environment";
import { IIntentService } from "../intent/intent-service.interface";
import { ToastStrings } from "../../models/toast-event";
import {
  ErrorMessages,
  SmartAuthoringBackendError,
} from "../interfaces/errors.interface";
import { ToastService } from "../toast/toast.service";
import { IExam } from "src/app/exam/models/exam.model";
import { ITask } from "src/app/task/models/task.model";

@Injectable({
  providedIn: "root",
})
export class CourseService implements IIntentService<ICourse> {
  constructor(private _httpClient: HttpClient, private _toastService: ToastService) {   
  }

  /**
   * Retrieves a course for the given id.
   *
   * @param id - The id for which to retrieve the course.
   * @returns An {@link Observable} with the retrieved {@link ICourse}
   */
  public getCourse(id: number): Observable<ICourse> {
    return this._httpClient
      .get<ICourse>(`${environment.apiUrl}/courses/${id}`)
      .pipe(
        tap((course) => (course.modifiedAt = new Date(course.modifiedAt!))),
        catchError((err, _) => this._errorHandler(err))
      );
  }

  /**
   * Retrieves all courses for the given organization.
   *
   * @param organization {@link IOrganization} for which to retrieve courses
   * @returns an {@link Observable} of type {@link ICourse}[]
   */
  public getCourses(organization: IOrganization): Observable<ICourse[]> {
    return this._httpClient
      .get<ICourse[]>(
        `${environment.apiUrl}/organizations/${organization.id}/courses`
      )
      .pipe(
        switchMap((courses) => from(courses)),
        tap((course) => (course.modifiedAt = new Date(course.modifiedAt!))),
        toArray(),
        catchError((err, _) => this._errorHandler(err))
      );
  }

  /**
   * Adds a course to the given organization.
   *
   * @param organization {@link IOrganization} to which the course should be added
   * @param course {@link ICourseBase} the course to be added
   * @returns an {@link Observable} of type {@link ICourse}
   */
  public addCourse(
    organization: IOrganization,
    course: ICourseBase
  ): Observable<ICourse> {
    const formData = new FormData();
    (Object.keys(course) as Array<keyof ICourseBase>).forEach((key) =>
      formData.set(key, course[key])
    );
    return this._httpClient
      .post<ICourse>(
        `${environment.apiUrl}/organizations/${organization.id}/courses`,
        formData
      )
      .pipe(catchError((err, _) => this._errorHandler(err)));
  }

  /**
   * Modifies the given course.
   *
   * @param course {@link ICourse} the course to be modified
   * @returns an {@link Observable} of type {@link ICourse}
   */
  public modifyCourse(course: ICourse): Observable<ICourse> {
    const formData = new FormData();
    (Object.keys(course) as Array<keyof ICourseBase>).forEach((key) =>
      formData.set(key, course[key])
    );
    return this._httpClient
      .put<ICourse>(`${environment.apiUrl}/courses/${course.id}`, formData)
      .pipe(catchError((err, _) => this._errorHandler(err)));
  }

  /**
   * Deletes the given course
   *
   * @param course {@link ICourse} the course to be delete
   * @returns an {@link Observable} of type {@link ICourse}
   */
  public deleteCourse(course: ICourse): Observable<ICourse> {
    return this._httpClient
      .delete<ICourse>(`${environment.apiUrl}/courses/${course.id}`)
      .pipe(catchError((err, _) => this._errorHandler(err)));
  }

  /**
   * Retrieves all course assets
   *
   * @param course - The {@link ICourse} for which to retrieve assets.
   * @returns An {@link Observable} containing all available {@link IAssetSource}[].
   */
  getCourseAssets(course: ICourse): Observable<IAssetSource[]> {
    return this._httpClient
      .get<IAssetSource[]>(`${environment.apiUrl}/courses/${course.id}/store`)
      .pipe(catchError((err, _) => this._errorHandler(err)));
  }

  /**
   * Base method for retrieving adding assets to a course.
   *
   * @param course - The {@link ICourse} to which the asset will be added
   * @param asset - The {@link IAsset} to which the asset will be added
   * @returns An {@link Observable} containing a link to the added asset {@link IAssetSource}.
   */
  addCourseAsset(course: ICourse, asset: IAsset): Observable<IAssetSource> {
    const formData = new FormData();
    (Object.keys(asset) as Array<keyof IAsset>).forEach((key) =>
      formData.set(key, asset[key])
    );
    return this._httpClient
      .post<IAssetSource>(
        `${environment.apiUrl}/courses/${course.id}/store`,
        formData
      )
      .pipe(catchError((err, _) => this._errorHandler(err)));
  }

  /**
   * Base method for exporting a scorm course.
   *
   * @param course - The {@link ICourse} which will be exportet.
   * @returns An {@link Observable} containing a zip file.
   */
  exportCourse(course: ICourse): Observable<any> {
    return this._httpClient
      .get<any>(`${environment.apiUrl}/courses/${course.id}/export`, {
        observe: "response",
        responseType: "blob" as "json",
      })
      .pipe(
        tap((r) => console.log(r)),
        tap((r) =>
          this._downloadFile(r.body, course.name + ".zip", "application/zip")
        ),
        catchError((err, _) => this._errorHandler(err))
      );
  }

  /**
   * Method for retrieving course exams
   *
   * @param course - The {@link ICourse} for which exams will be loaded
   * @returns An {@link Observable} containing Exams {@link IExam}.
   */
  public getExams(course: ICourse): Observable<IExam[]> {
    return this._httpClient
      .get<IExam[]>(`${environment.apiUrl}/courses/${course.id}/exams`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method for adding a course exam
   *
   * @param course - The {@link ICourse} for which an intent will be added
   * @param exam - The {@link IExam} that shall be created
   * @returns An {@link Observable} containing the created exam {@link IExam}.
   */
  public addExam(course: ICourse, exam: IExam): Observable<IExam> {
    return this._httpClient
      .post<IIntent>(`${environment.apiUrl}/courses/${course.id}/exams`, exam)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method to modify a course exam
   *
   * @param exam - The {@link IExam} to be edited
   * @returns An {@link Observable} containing the exam {@link IInIExamtent}.
   */
  public modifyExam(exam: IExam): Observable<IExam> {
    return this._httpClient
      .put<IExam>(`${environment.apiUrl}/courseExams/${exam.id}`, exam)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method for deleting a course exam
   *
   * @param exam - The {@link IExam} to be deleted
   * @returns An {@link Observable} containing the exam {@link IExam}.
   */
  public deleteExam(exam: IExam): Observable<IExam> {
    return this._httpClient
      .delete<IExam>(`${environment.apiUrl}/courseExams/${exam.id}`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  // ---------------------------------------------------------------------

  /**
   * Method for retrieving course tasks
   *
   * @param course - The {@link ICourse} for which tasks will be loaded
   * @returns An {@link Observable} containing Tasks {@link ITask}.
   */
  public getTasks(course: ICourse): Observable<ITask[]> {
    return this._httpClient
      .get<ITask[]>(`${environment.apiUrl}/courses/${course.id}/tasks`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method for adding a course task
   *
   * @param course - The {@link ICourse} for which an intent will be added
   * @param task - The {@link ITask} that shall be created
   * @returns An {@link Observable} containing the created task {@link ITask}.
   */
  public addTask(course: ICourse, task: ITask): Observable<ITask> {
    return this._httpClient
      .post<ITask>(`${environment.apiUrl}/courses/${course.id}/tasks`, task)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method to modify a course task
   *
   * @param task - The {@link ITask} to be edited
   * @returns An {@link Observable} containing the task {@link ITask}.
   */
  public modifyTask(task: ITask): Observable<ITask> {
    return this._httpClient
      .put<ITask>(`${environment.apiUrl}/courseTasks/${task.id}`, task)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method for deleting a course task
   *
   * @param task - The {@link ITask} to be deleted
   * @returns An {@link Observable} containing the task {@link ITask}.
   */
  public deleteTask(task: ITask): Observable<ITask> {
    return this._httpClient
      .delete<ITask>(`${environment.apiUrl}/courseTasks/${task.id}`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  // ---------------------------------------------------------------------

  /**
   * Method for retrieving course intents
   *
   * @param course - The {@link ICourse} for which intents will be loaded
   * @returns An {@link Observable} containing Intents {@link IIntent}.
   */
  public getIntents(course: ICourse): Observable<IIntent[]> {
    return this._httpClient
      .get<IIntent[]>(`${environment.apiUrl}/courses/${course.id}/intents`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method for adding a course intent
   *
   * @param course - The {@link ICourse} for which an intent will be added
   * @param intent - The {@link IIntent} that shall be created
   * @returns An {@link Observable} containing the created intent {@link IIntent}.
   */
  public addIntent(course: ICourse, intent: IIntent): Observable<IIntent> {
    return this._httpClient
      .post<IIntent>(`${environment.apiUrl}/courses/${course.id}/intents`, intent)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method to modify a course intent
   *
   * @param intent - The {@link IIntent} to be edited
   * @returns An {@link Observable} containing the intent {@link IIntent}.
   */
  public modifyIntent(intent: IIntent): Observable<IIntent> {
    return this._httpClient
      .put<IIntent>(`${environment.apiUrl}/courseIntents/${intent.id}`, intent)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Method for deleting a course intent
   *
   * @param intent - The {@link IIntent} to be deleted
   * @returns An {@link Observable} containing the intent {@link IIntent}.
   */
  public deleteIntent(intent: IIntent): Observable<IIntent> {
    return this._httpClient
      .delete<IIntent>(`${environment.apiUrl}/courseIntents/${intent.id}`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  /**
   * Base method for training bot with a course.
   * 
   * @param course - The {@link ICourse} to which the asset will be added
   * @returns An {@link Observable} with status message.
   */
   trainCourse(course: ICourse): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/courses/${course.id}/train`).pipe(
      tap(r => {
        console.log(r);
        this._toastService.showSuccessToast(
          ToastStrings.success_header,
          $localize`:BotTrainingRequestSucceeded|Message indicating that request to start bot training was successful@@courseService.requestTrainSuccessful: Training was successful ..`);
      }),
      catchError((err, _) => this._errorHandler(err))
    );
  }

  /**
   * Base method for a preview of a course.
   * 
   * @param course - The {@link ICourse} which wil lbe previewd
   * @returns An {@link Observable} with status message.
   */
  previewCourse(course: ICourse): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiUrl}/courses/${course.id}/preview`).pipe(
      tap(r => {
        console.log(r);
        let link = `Click <a style="color:white !important;" target='_blank' href='${environment.previewUrl}'>here</a> to open preview.`;
        this._toastService.showSuccessToast(
          ToastStrings.success_header,
          $localize`:CoursePreviewSucceeded|Message indicating that request to preview a course was successful@@courseService.requestPreviewSuccessful:Course is previewing... ${link}`);
      }),
      catchError((err, _) => this._errorHandler(err))
    );
  }

  private _downloadFile(data: any, filename: string, type: string): void {
    // const blob: Blob = new Blob([data], { type: type });

    // const url: string = window.URL.createObjectURL(blob);
    // const pwa: Window | null  = window.open(url);
    // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //     console.log('silent catch for now, apparently a pop up blocker is working')
    // }

    const element = document.createElement("a");
    element.href = URL.createObjectURL(data);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  }

  /**
   * Performance of a course 
   * 
   * @param course {@link ICourse} the course to get
   * @returns an {@link number} containing the performance.
   */
    public performanceCourse(course: ICourse): Observable<number> {
      return this._httpClient.get<number>(`${environment.apiUrl}/courses/${course.id}/performance`).pipe(
        catchError((err, _) => this._errorHandler(err))
      );
    }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    this._toastService.showErrorToast(ToastStrings.error_header, e.statusText);
    return throwError(new SmartAuthoringBackendError(e.status, ErrorMessages.unknown_error));
  }
}
