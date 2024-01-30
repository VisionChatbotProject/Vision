import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IBackendMessage } from 'src/app/core/models/base';
import { IOrganization } from 'src/app/core/models/organization';
import { IOrganizationRole, IOrganizationRoleBase } from 'src/app/core/models/organization_role';
import { environment } from 'src/environments/environment';
import { dummyOrganization, dummyOrganizationRoleBase, dummyOrganizationRoles } from 'src/testutils/object-mocks';
import { buildErrorMessage, handlesError, hasErrorHandler } from 'src/testutils/utils';
import { ErrorMessages } from '../interfaces/errors.interface';

import { OrganizationRoleService } from './organization-role.service';

describe('BackendOrganizationRoleService', () => {
  const TIMEOUT: number = 50;
  const errorMessage: string = 'some failure';

  let service: OrganizationRoleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationRoleService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve organization roles', () => {
    service.getOrganizationRoles(dummyOrganization).subscribe(
      organizationRoles => expect(organizationRoles).toEqual(dummyOrganizationRoles)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/' + dummyOrganization.id + '/roles');
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyOrganizationRoles);
  });

  it('should create a organization role', () => {
    let dummyOrganizationRole: IOrganizationRole = {
      id: 1,
      name: 'Administrator Light',
      modifiable: true,
      canModifyOrganizationDetails: true,
      canModifyOrganizationRoles: true,
      canModifyOrganizationMembers: true,
      canModifyOrganizationUnitDetails: false,
      canModifyOrganizationUnitRoles: false,
      canModifyOrganizationUnitMembers: false,
      canManageCourses: true
    }

    service.addOrganizationRole(dummyOrganization, dummyOrganizationRoleBase).subscribe(
      organizationRole => expect(organizationRole).toEqual(dummyOrganizationRole)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/' + dummyOrganization.id + '/roles');
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyOrganizationRole);
  });

  it('should modify an organization role', () => {
    let dummyOrganizationRole: IOrganizationRole = dummyOrganizationRoles[0];
    dummyOrganizationRole.name = 'Modified Administrator';

    service.modifyOrganizationRole(dummyOrganizationRole).subscribe(
      organizationRole => expect(organizationRole).toEqual(dummyOrganizationRole)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizationRoles/' + dummyOrganizationRole.id);
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(dummyOrganizationRole);
  });

  it('should delete an organization role', () => {
    let dummyBackendMessage: IBackendMessage = {
      detail: 'successfully deleted organization role'
    }
    let dummyOrganizationRole: IOrganizationRole = dummyOrganizationRoles[2];

    service.deleteOrganizationRole(dummyOrganizationRole).subscribe(
      backendMessage => expect(backendMessage).toEqual(dummyBackendMessage)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizationRoles/' + dummyOrganizationRole.id);
    expect(testRequest.request.method).toEqual('DELETE');
    testRequest.flush(dummyBackendMessage);
  });

  // Error handler testcases
  it('error handler should handle "unknown" errors  gracefully', doneCallback => {
    const errorResponse = buildErrorMessage('some unknown key', errorMessage);
    handlesError(service.getOrganizationRoles({ id: 1 } as IOrganization), httpTestingController, doneCallback, errorResponse, ErrorMessages.unknown_error);
  }, TIMEOUT);

  it('getOrganizationRoles should have an error handler attached', doneCallback => {
    hasErrorHandler(service.getOrganizationRoles({ id: 1 } as IOrganization), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('addOrganizationRole should have an error handler attached', doneCallback => {
    hasErrorHandler(service.addOrganizationRole({ id: 1 } as IOrganization, {} as IOrganizationRoleBase), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('modifyOrganizationRole should have an error handler attached', doneCallback => {
    hasErrorHandler(service.modifyOrganizationRole({ id: 1 } as IOrganizationRole), httpTestingController, doneCallback);
  }, TIMEOUT);

  it('deleteOrganizationRole should have an error handler attached', doneCallback => {
    hasErrorHandler(service.deleteOrganizationRole({ id: 1 } as IOrganizationRole), httpTestingController, doneCallback);
  }, TIMEOUT);

});
