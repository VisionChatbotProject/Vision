import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IInvite, IInviteBase } from 'src/app/core/models/invite';
import { IOrganization } from 'src/app/core/models/organization';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieves all invites for the given organization. 
   * 
   * @param organization {@link IOrganization} for which to retrieve invites
   * @returns an {@link Observable} of type {@link IInvite}[]
   */
  public getInvites(organization: IOrganization): Observable<IInvite[]> {
    return this._httpClient.get<IInvite[]>(`${environment.apiUrl}/invite/${organization.id}`).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Adds an invite to the given organization.
   * 
   * @param organization {@link IOrganization} to which the invite should be added
   * @param invite {@link IInviteBase} the invite to be added
   * @returns an {@link Observable} of type {@link IInvite}
   */
  public addInvite(organization: IOrganization, invite: IInviteBase): Observable<IInvite> {
    return this._httpClient.post<IInvite>(`${environment.apiUrl}/invite/${organization.id}`, invite).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }
}
