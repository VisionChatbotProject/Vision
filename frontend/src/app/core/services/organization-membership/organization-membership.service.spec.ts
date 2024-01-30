import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OrganizationMembershipService } from './organization-membership.service';
import { dummyOrganization, dummyOrganizationMembershipBase, dummyOrganizationMemberships } from 'src/testutils/object-mocks';
import { environment } from 'src/environments/environment';
import { IOrganizationMembership } from 'src/app/core/models/organization_membership';
import { IBackendMessage } from 'src/app/core/models/base';

describe('OrganizationMembershipBackendService', () => {
  let service: OrganizationMembershipService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationMembershipService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve organization memberships', () => {
    service.getOrganizationMemberships(dummyOrganization).subscribe(
      organizationMemberships => expect(organizationMemberships).toEqual(dummyOrganizationMemberships)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/' + dummyOrganization.id + '/memberships');
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyOrganizationMemberships);
  });

  it('should create organization memberships', () => {
    let dummyOrganizationMembership: IOrganizationMembership = {
      id: 1,
      firstName: 'john',
      lastName: 'doe',
      email: 'john.doe@test.com',
      role: 1,
      virtual: true
    }

    service.addOrganizationMembership(dummyOrganization, dummyOrganizationMembershipBase).subscribe(
      organizationMembership => expect(organizationMembership).toEqual(dummyOrganizationMembership)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/' + dummyOrganization.id + '/memberships');
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyOrganizationMembership);
  });

  it('should modify an organization membership', () => {
    let dummyOrganizationMembership: IOrganizationMembership = dummyOrganizationMemberships[0];
    dummyOrganizationMembership.email = 'john.doe@anothermail.com';

    service.modifyOrganizationMembership(dummyOrganizationMembership).subscribe(
      organizationMembership => expect(organizationMembership).toEqual(dummyOrganizationMembership)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizationMemberships/' + dummyOrganizationMembership.id);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(dummyOrganizationMembership);
  });

  it('should delete an organization membership', () => {
    let dummyBackendMessage: IBackendMessage = {
      detail: 'successfully deleted organization membership'
    }
    let dummyOrganizationMembership: IOrganizationMembership = dummyOrganizationMemberships[0];

    service.deleteOrganizationMembership(dummyOrganizationMembership).subscribe(
      backendMessage => expect(backendMessage).toEqual(dummyBackendMessage)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizationMemberships/' + dummyOrganizationMembership.id);
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(dummyBackendMessage);
  });

  it('should retrieve the current user`s membership', () => {
    let dummyOrganizationMembership: IOrganizationMembership = dummyOrganizationMemberships[0];

    service.getSelfMembership(dummyOrganization).subscribe(
      backendMessage => {
        expect(backendMessage).toEqual(dummyOrganizationMembership);
      }
    );

    const testRequest = httpTestingController.expectOne(`${environment.apiUrl}/organizations/${dummyOrganization.id}/selfMembership`);
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyOrganizationMembership);
  });
});
