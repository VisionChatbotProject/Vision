import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { dummyCourses, dummyOrganization, dummyOrganizationMembership, dummyOrganizationMemberships, dummyOrganizationRoles } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { ICourse } from '../../models/course';
import { IOrganization } from '../../models/organization';
import { IOrganizationMembership } from '../../models/organization_membership';
import { IOrganizationRole } from '../../models/organization_role';
import { CourseService } from '../course/course.service';
import { OrganizationRoleService } from '../organization-role/organization-role.service';
import { OrganizationMembershipService } from '../organization-membership/organization-membership.service';

import { ContextService } from './context.service';


describe('ContextService', () => {
  let service: ContextService;
  const TIMEOUT: number = 50;

  const expectedCourses: ICourse[] = dummyCourses;
  const expectedOrganizationRoles: IOrganizationRole[] = dummyOrganizationRoles;
  const expectedOrganizationMemberships: IOrganizationMembership[] = dummyOrganizationMemberships;
  const expectedMembership: IOrganizationMembership = dummyOrganizationMembership;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CourseService, useValue: authoringApiServiceMock.courseService },
        { provide: OrganizationMembershipService, useValue: authoringApiServiceMock.organizationMembershipService },
        { provide: OrganizationRoleService, useValue: authoringApiServiceMock.organizationRoleService },
      ]
    });

    authoringApiServiceMock.courseService.getCourses.and.returnValue(of(expectedCourses));
    authoringApiServiceMock.organizationRoleService.getOrganizationRoles.and.returnValue(of(expectedOrganizationRoles));
    authoringApiServiceMock.organizationMembershipService.getOrganizationMemberships.and.returnValue(of(expectedOrganizationMemberships));
    authoringApiServiceMock.organizationMembershipService.getSelfMembership.and.returnValue(of(expectedMembership));

    service = TestBed.inject(ContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize all fields to reasonable defaults', () => {
    expect(service.courses).toEqual([]);
    expect(service.organizationMemberships).toEqual([]);
    expect(service.self).toEqual({} as IOrganizationMembership);
    expect(service.organizationRoles).toEqual([]);
  });

  it('should throw if no organization has been set', () => {
    expect(function () { service.activeOrganization }).toThrow(jasmine.any(Error));
  });

  it('should retrieve the current organization correctly', () => {
    service.activeOrganization = dummyOrganization;
    expect(service.activeOrganization).toEqual(dummyOrganization);
  });

  it('should emit the organization after a "set" call', doneCallback => {
    service.activeOrganization$.subscribe(org => {
      expect(org).toEqual(dummyOrganization);
      expect(service.activeOrganization).toEqual(dummyOrganization);
      doneCallback();
    });

    service.activeOrganization = dummyOrganization;

  }, TIMEOUT);

  xit('should clear the current organization', () => {
    //todo: once #186 is fixed, this test can be included
    service.activeOrganization = dummyOrganization;
    expect(service.activeOrganization).toBeTruthy();
    service.clearOrganization();
    expect(service.activeOrganization).toBe(undefined as unknown as IOrganization);
  });

  it('should retrieve all fields when the organization is set', () => {
    service.activeOrganization = dummyOrganization;

    expect(service.courses).toEqual(expectedCourses);
    expect(service.organizationMemberships).toEqual(expectedOrganizationMemberships);
    expect(service.organizationRoles).toEqual(expectedOrganizationRoles);
    expect(service.self).toEqual(expectedMembership);
  });

  it('should call the "activeOrganization" setter when reloading', () => {
    const activeOrganizationSpy = spyOnProperty(service, 'activeOrganization', 'set');
    service.reloadContext();
    expect(activeOrganizationSpy).toHaveBeenCalled();
  });

  it('should store the "activeOrganization" in the local storage', () => {
    service.activeOrganization = dummyOrganization;

    expect(JSON.parse(localStorage.getItem(service.selectedOrganizationKey)!)).toEqual(dummyOrganization);
  });

  it('should remove the "activeOrganization" from local storage when clearing', () => {
    service.activeOrganization = dummyOrganization;

    service.clearOrganization();

    expect(localStorage.getItem(service.selectedOrganizationKey)).toBeNull();
  });

  it('can get and set organizations', () => {
    expect(service.organizations).toEqual([]);

    service.organizations = [dummyOrganization];
    
    expect(service.organizations).toEqual([dummyOrganization]);
  })
});
