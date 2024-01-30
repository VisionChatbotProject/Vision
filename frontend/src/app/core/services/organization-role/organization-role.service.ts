import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IBackendMessage } from 'src/app/core/models/base';
import { IOrganization } from 'src/app/core/models/organization';
import { IOrganizationRole, IOrganizationRoleBase } from 'src/app/core/models/organization_role';
import { environment } from 'src/environments/environment';
import { ErrorMessages, SmartAuthoringBackendError } from '../interfaces/errors.interface';

@Injectable({
  providedIn: 'root'
})
export class OrganizationRoleService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieves all organization roles for the given organization.
   * 
   * @param organization - The organization {@link IOrganization} from which all organization roles are retrieved.
   * @returns An {@link Observable} with all retrieved {@link IOrganizationRole}[]
   */
  public getOrganizationRoles(organization: IOrganization): Observable<IOrganizationRole[]> {
    return this._httpClient.get<IOrganizationRole[]>(environment.apiUrl + '/organizations/' + organization.id + '/roles').pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Adds the given role {@link IOrganizationRoleBase} to the given organization {@link IOrganization}.
   * 
   * @param organization The organization {@link IOrganization} to which the given organization role should be added.
   * @param role The organization role {@link IOrganizationRoleBase} to be added to the given organization.
   * @returns An {@link Observable} containing the created organization role {@link IOrganizationRole}
   */
  public addOrganizationRole(organization: IOrganization, role: IOrganizationRoleBase): Observable<IOrganizationRole> {
    return this._httpClient.post<IOrganizationRole>(environment.apiUrl + '/organizations/' + organization.id + '/roles', role).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Modifies the given organization role {@link IOrganizationRole}.
   * 
   * @param organizationRole The organization role {@link IOrganizationRole} that should be modified.
   * @returns An {@link Observable} containing the modified organization role {@link IOrganizationRole}
   */
  public modifyOrganizationRole(organizationRole: IOrganizationRole): Observable<IOrganizationRole> {
    return this._httpClient.put<IOrganizationRole>(environment.apiUrl + '/organizationRoles/' + organizationRole.id, organizationRole).pipe(
      catchError(this._errorHandler)
    );
  }

  /**
   * Deletes the given organization role {@link IOrganizationRole}.
   * 
   * @param organizationRole the organization role {@link IOrganizationRole} that should be deleted.
   * @returns An {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public deleteOrganizationRole(organizationRole: IOrganizationRole): Observable<IBackendMessage> {
    return this._httpClient.delete<IBackendMessage>(environment.apiUrl + '/organizationRoles/' + organizationRole.id).pipe(
      catchError(this._errorHandler)
    );
  }

  private _errorHandler(e: HttpErrorResponse): Observable<any> {
    let errorMessage: string = ErrorMessages.unknown_error;
    return throwError(new SmartAuthoringBackendError(e.status, errorMessage));
  }
}
