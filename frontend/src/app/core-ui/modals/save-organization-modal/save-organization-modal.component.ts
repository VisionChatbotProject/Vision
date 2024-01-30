import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IOrganization, IOrganizationBase } from 'src/app/core/models/organization';
import { ELanguage } from 'src/app/core/models/base';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';

@Component({
  selector: 'app-save-organization-modal',
  templateUrl: './save-organization-modal.component.html',
  styleUrls: ['./save-organization-modal.component.scss']
})
export class SaveOrganizationModal {

  public static MODAL_OPTIONS: NgbModalOptions = { backdrop: 'static', centered: true, size: 'lg' };

  /**
   * This pattern is used for the organization url validation
   */
  private _organizationUrlPattern: string = '(https?://)([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  private _languages = Object.values(ELanguage);

  private _saveOrganizationForm : FormGroup = this._formBuilder.group({
    name: new FormControl('', Validators.required),
    url: new FormControl('https://', [Validators.required, Validators.pattern(this._organizationUrlPattern)]),
    language: new FormControl(ELanguage.eEnglish)
  });
  
  public get languages(): ELanguage[] { return this._languages; }
  public get createOrganizationModalForm() : FormGroup { return this._saveOrganizationForm; }
  public get name() : FormControl { return this._saveOrganizationForm.get('name') as FormControl; }
  public get url() : FormControl { return this._saveOrganizationForm.get('url') as FormControl; }
  public get language(): FormControl { return this._saveOrganizationForm.get('language') as FormControl; }
  
  private _organization: IOrganization | null = null;
  public get organization(): IOrganization | null { return this._organization; }
  @Input() public set organization(organization: IOrganization | null) {
    this._organization = organization;
    if(this._organization != null) {
      this._saveOrganizationForm.patchValue(this._organization!);
    }
  }

  public get activeModal(): NgbActiveModal { return this._activeModal; }

  public saveOrganization(): void {
    if(this._organization != null) {
      const organization: IOrganization = {
        id: this.organization!.id,
        name: this.name.value,
        language: this.language.value,
        url: this.url.value,
        createdBy: this.organization!.createdBy,
      }

      this._authoringApi.organizationService.modifyOrganization(organization).subscribe(
        org => this.activeModal.close(org)
      );
    }
    else {
      const newOrganization: IOrganizationBase = {
        name: this.name.value,
        url: this.url.value,
        language: this.language.value
      };
      this._authoringApi.organizationService.addOrganization(newOrganization).subscribe(
        org => this.activeModal.close(org)
      );
    }
  }
  
  constructor(private _activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private _authoringApi: AuthoringApiService
  ) { }
}