import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ICourse } from '../../models/course';
import { IOrganization } from '../../models/organization';
import { IOrganizationMembership } from '../../models/organization_membership';
import { IOrganizationRole } from '../../models/organization_role';
import { CourseService } from '../course/course.service';
import { OrganizationRoleService } from '../organization-role/organization-role.service';
import { OrganizationMembershipService } from '../organization-membership/organization-membership.service';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  
  private _organizations: IOrganization[] = [];
  public get organizations(): IOrganization[] { return this._organizations; }
  public set organizations(organizations: IOrganization[]) {
    this._organizations = organizations;
  }

  private _organizationMemberships: IOrganizationMembership[] = [];
  public get organizationMemberships(): IOrganizationMembership[] { return this._organizationMemberships; }

  private _organizationRoles: IOrganizationRole[] = [];
  public get organizationRoles(): IOrganizationRole[] { return this._organizationRoles; }

  private _courses: ICourse[] = [];
  public get courses(): ICourse[] { return this._courses; }

  private _self: IOrganizationMembership = {} as IOrganizationMembership;
  public get self(): IOrganizationMembership { return this._self; }

  public get selectedOrganizationKey(): string { return 'selectedOrganization'; }

  private _activeOrganizationSubject: ReplaySubject<IOrganization> = new ReplaySubject(1);
  private _activeOrganization$: Observable<IOrganization> = this._activeOrganizationSubject.asObservable();
  public get activeOrganization$(): Observable<IOrganization> { return this._activeOrganization$; }

  private _activeOrganization: IOrganization | null = null;
  public set activeOrganization(organization: IOrganization) {
    this._activeOrganization = organization;

    of(true).pipe(
      switchMap(_ => this._organizationMembershipService.getSelfMembership(this._activeOrganization!)),
      tap(membership => this._self = membership),
      switchMap(_ => this._organizationMembershipService.getOrganizationMemberships(this._activeOrganization!)),
      tap(memberships => this._organizationMemberships = memberships),
      switchMap(_ => this._organizationRoleService.getOrganizationRoles(this._activeOrganization!)),
      tap(organizationRoles => this._organizationRoles = organizationRoles),
      switchMap(_ => this._courseService.getCourses(this._activeOrganization!)),
      tap(courses => this._courses = courses),
    ).subscribe(_ => this._activeOrganizationSubject.next(organization));

    localStorage.setItem(this.selectedOrganizationKey, JSON.stringify(organization));
  }

  public get activeOrganization(): IOrganization {
    if (this._activeOrganization == null) { throw new Error('Active organization is null'); }
    return this._activeOrganization;
  }

  public clearOrganization(): void {
    this._activeOrganizationSubject.next(undefined);
    localStorage.removeItem(this.selectedOrganizationKey);
  }

  public reloadContext(): void {
    this.activeOrganization = this._activeOrganization!;
  }

  constructor(
    private _organizationMembershipService: OrganizationMembershipService,
    private _organizationRoleService: OrganizationRoleService,
    private _courseService: CourseService
  ) { }
}
