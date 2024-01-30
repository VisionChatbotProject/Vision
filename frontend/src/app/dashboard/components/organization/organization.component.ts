import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InviteMemberModalComponent } from 'src/app/core-ui/modals/invite-member-modal/invite-member-modal.component';
import { IOrganization } from 'src/app/core/models/organization';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'dab-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent {

  private _activeOrganization: IOrganization = this._authoringApi.contextService.activeOrganization;
  public get activeOrganization(): IOrganization { return this._activeOrganization; }

  constructor(
    private _authoringApi : AuthoringApiService,
    private _modalService: NgbModal
  ) { }
}
