import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IOrganizationRole } from 'src/app/core/models/organization_role';
import { IInviteBase } from 'src/app/core/models/invite';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'app-invite-member-modal',
  templateUrl: './invite-member-modal.component.html',
  styleUrls: ['./invite-member-modal.component.scss']
})
export class InviteMemberModalComponent {

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'lg' };

  private _roles: IOrganizationRole[] | [] = [];
  public get roles(): IOrganizationRole[] | [] { return this._roles; }
  @Input() public set roles(roles: IOrganizationRole[]) {
    this._roles = roles;
    this.role.setValue(roles[0].id)
  }

  private _createInviteMemberModalForm: FormGroup = this._formBuilder.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl()
  });

  public get activeModal() : NgbActiveModal { return this._activeModal; }

  public get createInviteMemberModalForm(): FormGroup { return this._createInviteMemberModalForm; }
  public get firstName(): FormControl { return this._createInviteMemberModalForm.get('firstName') as FormControl; }
  public get lastName(): FormControl { return this._createInviteMemberModalForm.get('lastName') as FormControl; }
  public get email(): FormControl { return this._createInviteMemberModalForm.get('email') as FormControl; }
  public get role(): FormControl { return this._createInviteMemberModalForm.get('role') as FormControl; }

  constructor(
    private _activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private _authoringApi: AuthoringApiService
  ) { }

  public createInvite() {
    let invite: IInviteBase = {
      firstName: this._createInviteMemberModalForm.value.firstName,
      lastName: this._createInviteMemberModalForm.value.lastName,
      email: this._createInviteMemberModalForm.value.email,
      role: this._createInviteMemberModalForm.value.role
    };

    this._authoringApi.inviteService.addInvite(this._authoringApi.contextService.activeOrganization, invite).subscribe(
      _ => this._activeModal.close(invite)
    );
  }
}
