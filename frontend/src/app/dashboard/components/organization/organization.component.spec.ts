import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { dummyOrganization, dummyOrganizationMembership, dummyOrganizationRoles } from 'src/testutils/object-mocks';
import { clickElement, spyOnGetter } from 'src/testutils/utils';
import { of } from 'rxjs';
import { dummyOrganizationMemberships } from 'src/testutils/object-mocks';

import { OrganizationComponent } from './organization.component';
import { NgbModalRefMock, OrganizationPreviewMock, PanelToggleMock } from 'src/testutils/component-mocks';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationComponent, OrganizationPreviewMock, PanelToggleMock ],
      imports: [NgbAccordionModule, FontAwesomeIconsModuleMock],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization').and.returnValue(dummyOrganization);
    authoringApiServiceMock.organizationMembershipService.getOrganizationMemberships.and.returnValue(of(dummyOrganizationMemberships));
    authoringApiServiceMock.organizationRoleService.getOrganizationRoles.and.returnValue(of(dummyOrganizationRoles));
    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
