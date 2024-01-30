import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EVisibilityStatus, VisibilityManagerService } from '../../services/visibility-manager.service';

@Component({
  selector: 'sma-sidebar',
  templateUrl: './sidebar-holder.component.html',
  styleUrls: ['./sidebar-holder.component.scss']
})
export class SidebarHolderComponent {

  private _isSidebarCollapsed = true;
  public get isSidebarCollapsed() : boolean { return this._isSidebarCollapsed; }
  public set isSidebarCollapsed(v : boolean) { this._isSidebarCollapsed = v; }

  private _sidebarVisibilityChange$ : Observable<EVisibilityStatus> = this._visibilityManagerService.sidebarVisibilityChanged$.pipe(
    tap(value => this.isSidebarCollapsed = value == EVisibilityStatus.eHidden),
  );
  public get sidebarVisibilityChange$(): Observable<EVisibilityStatus> { return this._sidebarVisibilityChange$; }

  constructor(
    private _visibilityManagerService : VisibilityManagerService
  ) { }

}
