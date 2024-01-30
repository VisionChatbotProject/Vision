import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { InviteMemberModalComponent } from 'src/app/core-ui/modals/invite-member-modal/invite-member-modal.component';
import { SaveOrganizationModal } from 'src/app/core-ui/modals/save-organization-modal/save-organization-modal.component';
import { IInvite } from 'src/app/core/models/invite';
import { IOrganization } from 'src/app/core/models/organization';
import { IOrganizationMembership } from 'src/app/core/models/organization_membership';
import { IOrganizationRole } from 'src/app/core/models/organization_role';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent {

  private _activeOrganization: IOrganization = this._authoringApi.contextService.activeOrganization;
  public get activeOrganization(): IOrganization { return this._activeOrganization; }

  private _memberships$: Observable<IOrganizationMembership[]> = this._loadOrganizationMemberships();
  public get memberships$(): Observable<IOrganizationMembership[]> { return this._memberships$; }

  private _invites$: Observable<IInvite[]> = this._loadInvites();
  public get invites$(): Observable<IInvite[]> { return this._invites$; }

  private _canEdit: boolean = false;
  public get canEdit(): boolean { return this._canEdit; }


  constructor(
    private _authoringApi: AuthoringApiService,
    private _modalService: NgbModal,
  ) {
    const selfRoleId: number = this._authoringApi.contextService.self.role;
    const selfRole: IOrganizationRole = this._authoringApi.contextService.organizationRoles.find(({ id }) => id == selfRoleId)!;
    this._canEdit = selfRole.canModifyOrganizationDetails;

  }

  public editInvite(inviteId: number): void {
    console.log(`editInvite(${inviteId})`);
    throw Error("not implemented");
  }

  public deleteInvite(inviteId: number): void {
    console.log(`deleteInvite(${inviteId})`);
    throw Error("not implemented");
  }

  public addMember(): void {
    const modalRef: NgbModalRef = this._modalService.open(InviteMemberModalComponent, InviteMemberModalComponent.MODAL_OPTIONS);
    modalRef.componentInstance.roles = this._authoringApi.contextService.organizationRoles;
    modalRef.result.then(_ => this._authoringApi.contextService.reloadContext(), _ => _);
  }

  public editMember(memberId: number): void {
    console.log(`editMember(${memberId})`)
    throw Error("not implemented");
  }

  public deleteMember(memberId: number): void {
    this._authoringApi.organizationMembershipService.deleteOrganizationMembership({ "id": memberId } as IOrganizationMembership)
      .pipe(take(1),
      ).subscribe(_ => {
        this._authoringApi.contextService.reloadContext()
      });
  }

  public editOrganization(): void {
    const modalRef: NgbModalRef = this._modalService.open(SaveOrganizationModal, SaveOrganizationModal.MODAL_OPTIONS);
    modalRef.componentInstance.organization = this._activeOrganization!;
    modalRef.result.then(
      _ => this._authoringApi.contextService.reloadContext()
    );
  }

  private _loadOrganizationMemberships(): Observable<IOrganizationMembership[]> {
    return this._authoringApi.organizationMembershipService.getOrganizationMemberships(
      this._activeOrganization
    );
  }

  private _loadInvites(): Observable<IInvite[]> {
    return this._authoringApi.inviteService.getInvites(this._activeOrganization);
  }

  public organizations(): IOrganization[] {
    return this._authoringApi.contextService.organizations;
  }

  public selectOrganization(organization: IOrganization): void {
    this._authoringApi.contextService.activeOrganization = organization;
  }
}
