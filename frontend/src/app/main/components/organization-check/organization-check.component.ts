import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SaveOrganizationModal } from 'src/app/core-ui/modals/save-organization-modal/save-organization-modal.component';
import { IOrganization, IOrganizationBase } from 'src/app/core/models/organization';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'ssa-organization-check',
  templateUrl: './organization-check.component.html',
  styleUrls: ['./organization-check.component.scss']
})
export class OrganizationCheckComponent {
  private _organizationLoaded$: Observable<boolean> = this._authoringApi.organizationService.getOrganizations().pipe(
      switchMap(organizations => {
        if (organizations.length > 0) {
          this._authoringApi.contextService.organizations = organizations;
          let candidateOrgString: string = localStorage.getItem(this._authoringApi.contextService.selectedOrganizationKey) || JSON.stringify(organizations[0]);
          let candidateOrg: IOrganization = JSON.parse(candidateOrgString);
          if(organizations.find(org => org.id == candidateOrg.id) == undefined) {
            return of(organizations[0]);
          }
          return of(candidateOrg);
        } else {
          return this._createOrganization();
        }
      }),
      switchMap(organization => { this._authoringApi.contextService.activeOrganization = organization; return of(true); } ),
    );
  public get organizationLoaded$(): Observable<boolean> { return this._organizationLoaded$; }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _modalService: NgbModal,
  ) { }

  private _createOrganization(): Observable<IOrganization> {
    return from(this._modalService.open(SaveOrganizationModal, SaveOrganizationModal.MODAL_OPTIONS).result)
  }
}
