import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrganization } from 'src/app/core/models/organization';
import { IOrganizationMembership, IOrganizationMembershipBase } from 'src/app/core/models/organization_membership';
import { IBackendMessage } from 'src/app/core/models/base';


@Injectable({
  providedIn: 'root'
})
export class OrganizationMembershipService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieves all organization memberships for the given organization.
   * 
   * @param organization - The organization {@link IOrganization} from which all organization memberships are retrieved.
   * @returns An {@link Observable} with all retrieved {@link IOrganizationMembership}[]
   */
  public getOrganizationMemberships(organization: IOrganization): Observable<IOrganizationMembership[]> {
    return this._httpClient.get<IOrganizationMembership[]>(environment.apiUrl + '/organizations/' + organization.id + '/memberships');
  }

  /**
   * Retrieves the organization memberships for the given organization and the currently logged in user.
   * 
   * @param organization - The organization {@link IOrganization} from which all organization memberships are retrieved.
   * @returns An {@link Observable} with all retrieved {@link IOrganizationMembership}[]
   */
  public getSelfMembership(organization: IOrganization): Observable<IOrganizationMembership> {
    return this._httpClient.get<IOrganizationMembership>(environment.apiUrl + '/organizations/' + organization.id + '/selfMembership');
  }

  /**
   * Adds the given membership {@link IOrganizationMembershipBase} to the given organization {@link IOrganization}.
   * 
   * @param organization The organization {@link IOrganization} to which the given organization membership should be added.
   * @param membership The organization membership {@link IOrganizationMembershipBase} to be added to the given organization.
   * @returns An {@link Observable} containing the created organization membership {@link IOrganizationMembership}
   */
  public addOrganizationMembership(organization: IOrganization, membership: IOrganizationMembershipBase): Observable<IOrganizationMembership> {
    return this._httpClient.post<IOrganizationMembership>(environment.apiUrl + '/organizations/' + organization.id + '/memberships', membership);
  }

  /**
   * Modifies the given organization membership {@link IOrganizationMembership}.
   * 
   * @param organizationMembership The organization membership {@link IOrganizationMembership} that should be modified.
   * @returns An {@link Observable} containing the modified organization membership {@link IOrganizationMembership}
   */
  public modifyOrganizationMembership(organizationMembership: IOrganizationMembership): Observable<IOrganizationMembership> {
    return this._httpClient.put<IOrganizationMembership>(environment.apiUrl + '/organizationMemberships/' + organizationMembership.id, organizationMembership);
  }

  /**
   * Deletes the given organization membership {@link IOrganizationMembership}.
   * 
   * @param organizationMembership the organization membership {@link IOrganizationMembership} that should be deleted.
   * @returns An {@link Observable} of type {@link IBackendMessage} for user feedback.
   */
  public deleteOrganizationMembership(organizationMembership: IOrganizationMembership): Observable<IBackendMessage> {
    return this._httpClient.delete<IBackendMessage>(environment.apiUrl + '/organizationMemberships/' + organizationMembership.id);
  }
}
