import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { IOrganization } from 'src/app/core/models/organization';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { VisibilityManagerService } from 'src/app/navigation/services/visibility-manager.service';

@Component({
  selector: 'ssa-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.scss'],
  providers : [VisibilityManagerService]
})
export class HolderComponent implements OnInit {

  private _activeOrganization$: Observable<IOrganization> = this._authoringApi.contextService.activeOrganization$.pipe(
    tap(_ => this._organizationLoaded$ = of(false)),
    tap(_ => this._changeDetector.detectChanges()),
    tap(_ => this._organizationLoaded$ = of(true)),
  );
  
  public get activeOrganization$(): Observable<IOrganization> { return this._activeOrganization$; }

  private _organizationLoaded$: Observable<boolean> = new Observable();
  public get organizationLoaded$(): Observable<boolean> { return this._organizationLoaded$; }

  constructor(
    private _authoringApi: AuthoringApiService,
    private _changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

}
