import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrganization, IOrganizationBase } from '../../models/organization';

/**
 * A service responsible for managing organizations.
 * It is discouraged to use this service directly.
 * Access it via injecting {@link AuthoringApiService}
 * 
 * Provided functionality:\
 * -> Retrieval of organizations\
 * -> Creation of organizations\
 * -> Modification of organizations
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Retrieves all organizations associated with the currently logged in user.
   * Associated entails, that the user is a member of the company.
   * 
   * @returns An {@link Observable} with all retrieved {@link IOrganization}[]
   */
  public getOrganizations(): Observable<IOrganization[]> {
    return this._httpClient.get<IOrganization[]>(environment.apiUrl + '/organizations/');
  }

  /**
   * Adds the given organization.
   * Since the backend automatically adds the user as member, 
   * no seperate calls are necessary.
   * 
   * @param organization - The {@link IOrganizationBase} to be added
   * @returns An {@link Observable} containing the create {@link IOrganization}.
   * 
   */
  public addOrganization(organization: IOrganizationBase): Observable<IOrganization> {
    return this._httpClient.post<IOrganization>(environment.apiUrl + '/organizations/', organization);
  }

  /**
   * Modifies the given organization.
   * The backend will perform permission checks to see if changing the
   * organization is allowed.
   * 
   * @param organization - The modified {@link IOrganization} object.
   * @returns An {@link Observable} containing the modified {@link IOrganization}.
   * 
   */
  public modifyOrganization(organization: IOrganization): Observable<IOrganization> {
    return this._httpClient.put<IOrganization>(environment.apiUrl + '/organizations/' + organization.id, organization);
  }
}
