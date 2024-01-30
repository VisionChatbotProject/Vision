import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { EVisibilityStatus, VisibilityManagerService } from '../../services/visibility-manager.service';

@Component({
  selector: 'sma-topbar',
  templateUrl: './topbar-holder.component.html',
  styleUrls: ['./topbar-holder.component.scss']
})
export class TopbarHolderComponent implements OnInit {

  private _isTopbarCollapsed = true;
  public get isTopbarCollapsed(): boolean { return this._isTopbarCollapsed; }
  public set isTopbarCollapsed(v: boolean) { this._isTopbarCollapsed = v; }
  

  private _name: string = '';
  public get name(): string { return this._name; }

  private _context$: Observable<boolean> = this._authoringApi.contextService.activeOrganization$.pipe(
    tap(organization => this._name = this._authoringApi.contextService.self.firstName + ' ' + this._authoringApi.contextService.self.lastName ),
    switchMap(_ => of(true))
  );
  public get context$(): Observable<boolean> { return this._context$; }


  constructor(
    private _authoringApi: AuthoringApiService,
    private _router: Router,
    private _visibilityManagerService: VisibilityManagerService
  ) { }

  ngOnInit(): void {
  }

  /**
   * Logout the user and redirects to the login page
   */
  public logout(): void {
    this._authoringApi.authService.logout().pipe(
      take(1),
      tap(_ => this._authoringApi.contextService.clearOrganization())
    ).subscribe(
      _ => this._router.navigate(['/login']),
    );
  }

  /**
   * Toggles the sidebar
   */
  public toggleSidebar(): void {
    let targetVisibility: EVisibilityStatus = EVisibilityStatus.eShown;
    if(this._visibilityManagerService.sidebarVisibility == EVisibilityStatus.eShown) {
      targetVisibility = EVisibilityStatus.eHidden;
    }
    this._visibilityManagerService.sidebarVisibility = targetVisibility;
  }

}
