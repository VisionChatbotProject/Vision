import { Component } from '@angular/core';
import { IOrganization } from 'src/app/core/models/organization';
import { IOrganizationMembership } from 'src/app/core/models/organization_membership';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'dab-organization-preview',
  templateUrl: './organization-preview.component.html',
  styleUrls: ['./organization-preview.component.scss']
})
export class OrganizationPreviewComponent {

  private _organization : IOrganization = this._authoringApi.contextService.activeOrganization;
  public get organization() : IOrganization | null { return this._organization; }

  private _memberships: IOrganizationMembership[] = this._authoringApi.contextService.organizationMemberships;
  public get memberships(): IOrganizationMembership[] | null { return this._memberships; }
  
  constructor(
    private _authoringApi: AuthoringApiService
  ) { }
}
