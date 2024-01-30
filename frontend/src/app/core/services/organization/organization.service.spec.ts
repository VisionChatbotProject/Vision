import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { OrganizationService } from './organization.service';

import { dummyOrganizationBase, dummyOrganizations } from 'src/testutils/object-mocks'
import { IOrganization } from '../../models/organization';
import { ELanguage } from '../../models/base';

describe('OrganizationBackendService', () => {
  let service: OrganizationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve organizations', () => {
    service.getOrganizations().subscribe(
      organizations => expect(organizations).toEqual(dummyOrganizations)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/')
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush(dummyOrganizations);
  });

  it('should create organizations', () => {
    let dummyOrganization: IOrganization = {
      language: ELanguage.eEnglish,
      name: 'dummyName',
      url: 'https://www.dummyName.com',
      createdBy: 1,
      id: 1,
    }

    service.addOrganization(dummyOrganizationBase).subscribe(
      organization => expect(organization).toEqual(dummyOrganization)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/')
    expect(testRequest.request.method).toEqual('POST');
    testRequest.flush(dummyOrganization);
  });

  it('should modify organizations', () => {
    let dummyOrganization: IOrganization = dummyOrganizations[0];
    dummyOrganization.name = 'DefinitlyAnotherCompanyName'

    service.modifyOrganization(dummyOrganization).subscribe(
      organization => expect(organization).toEqual(dummyOrganization)
    );

    const testRequest = httpTestingController.expectOne(environment.apiUrl + '/organizations/' + dummyOrganization.id)
    expect(testRequest.request.method).toEqual('PUT');
    testRequest.flush(dummyOrganization);
  });

});
