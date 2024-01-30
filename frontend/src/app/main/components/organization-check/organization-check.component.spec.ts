import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { IOrganization, IOrganizationBase } from 'src/app/core/models/organization';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyOrganization, dummyOrganizations } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { spyOnSetter } from 'src/testutils/utils';

import { OrganizationCheckComponent } from './organization-check.component';

describe('OrganizationCheckComponent', () => {
  let component: OrganizationCheckComponent;
  let fixture: ComponentFixture<OrganizationCheckComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationCheckComponent],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    localStorage.removeItem('selectedOrg');
  });

  it('should create', () => {
    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of([dummyOrganization]));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should set the first available organization as active', () => {
    let controlValue: any = null;
    
    spyOnSetter(authoringApiServiceMock.contextService, 'activeOrganization').and.callFake(v => controlValue = v);
    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of(dummyOrganizations));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(controlValue).toEqual(dummyOrganizations[0]);
  });

  it('should call the "createOrganization" method if no organization is present', () => {
    let controlValue: any = null;
    let mockedOrganization: IOrganization = {
      name: 'MOCKED'
    } as IOrganization;
    
    spyOnSetter(authoringApiServiceMock.contextService, 'activeOrganization').and.callFake(v => controlValue = v);
    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of([]));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;

    spyOn<any>(component, '_createOrganization').and.returnValue(of(mockedOrganization))
    fixture.detectChanges();

    expect(controlValue).toEqual(mockedOrganization);
  });

  it('should return the stored organization if it matches one of the loaded ones', () => {
    let controlValue: any = null;

    localStorage.setItem('selectedOrg', JSON.stringify(dummyOrganizations[1]));

    spyOnSetter(authoringApiServiceMock.contextService, 'activeOrganization').and.callFake(v => controlValue = v);
    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of(dummyOrganizations));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(controlValue).toEqual(dummyOrganizations[1]);
  });

  it('should return the first organization if the stored organization does not match any loaded one', () => {
    let controlValue: any = null;
    
    const mockedOrg: IOrganization = {
      id: -1
    } as IOrganization;

    localStorage.setItem('selectedOrg', JSON.stringify(mockedOrg));

    spyOnSetter(authoringApiServiceMock.contextService, 'activeOrganization').and.callFake(v => controlValue = v);
    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of(dummyOrganizations));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(controlValue).toEqual(dummyOrganizations[0]);
  });

  it('should return the first organization if no organization is stored', () => {
    let controlValue: any = null;
    
    spyOnSetter(authoringApiServiceMock.contextService, 'activeOrganization').and.callFake(v => controlValue = v);
    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of(dummyOrganizations));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(controlValue).toEqual(dummyOrganizations[0]);
  });

  it('"createOrganization" should open a modal and add the organization', doneCallback => {
    let mockedOrganization: IOrganizationBase = {
      name: 'MOCKED'
    } as IOrganizationBase;

    authoringApiServiceMock.organizationService.getOrganizations.and.returnValue(of([]));
    let modalMock = new NgbModalRefMock();
    modalMock.result = new Promise((resolve, reject) => resolve(mockedOrganization));

    fixture = TestBed.createComponent(OrganizationCheckComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal)

    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)

    fixture.detectChanges();

    component['_createOrganization']().subscribe(organization => {
      expect(modalServiceSpy).toHaveBeenCalled();
      expect(organization).toEqual(mockedOrganization as IOrganization);
      doneCallback();
    });
  });

});
