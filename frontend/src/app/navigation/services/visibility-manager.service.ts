import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export enum EVisibilityStatus {
  eShown,
  eHidden,
}

@Injectable()
export class VisibilityManagerService {

  private _sidebarVisibilityChanged: ReplaySubject<EVisibilityStatus> = new ReplaySubject(1);
  public sidebarVisibilityChanged$: Observable<EVisibilityStatus> = this._sidebarVisibilityChanged.asObservable();
  
  private _sidebarVisibility: EVisibilityStatus = EVisibilityStatus.eHidden;
  public get sidebarVisibility(): EVisibilityStatus { return this._sidebarVisibility; }
  public set sidebarVisibility(v: EVisibilityStatus) { this._sidebarVisibility = v; this._sidebarVisibilityChanged.next(v); }

  constructor() {}
}
