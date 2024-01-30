import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { IBackendMessage } from 'src/app/core/models/base';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { InviteTableComponentMock, MemberTableComponentMock, NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyInvites, dummyOrganization, dummyOrganizationMembership, dummyOrganizationRoles } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, spyOnGetter } from 'src/testutils/utils';

import { OrganizationComponent } from './organization.component';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FontAwesomeIconsModuleMock, NgbAccordionModule, TableModule],
      declarations: [
        OrganizationComponent,
        MemberTableComponentMock,
        InviteTableComponentMock,
      ],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    spyOnGetter(authoringApiServiceMock.contextService, 'self').and.returnValue(dummyOrganizationMembership);
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization').and.returnValue(dummyOrganization);
    spyOnGetter(authoringApiServiceMock.contextService, 'organizationRoles').and.returnValue(dummyOrganizationRoles);
    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "editOrganization" when its button is clicked', () => {
    let editOrganizationSpy = spyOn(component, 'editOrganization');
    fixture.detectChanges();
    clickElement(fixture, '#editOrganizationButton');
    expect(editOrganizationSpy).toHaveBeenCalled();
  });

  it('should open a modal when the "edit organization" is called', () => {
    let modalMock: NgbModalRefMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);
    let modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
    modalMock.result = new Promise((resolve, _) => resolve(dummyOrganization));

    component.editOrganization();
    expect(modalServiceSpy).toHaveBeenCalled();
  });

  it('should open a modal when "addMember" is called', () => {
    let modalMock: NgbModalRefMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal);

    const modalServiceSpy = spyOn(modalService, "open").and.returnValue(modalMock as NgbModalRef);
    modalMock.result = new Promise((resolve, _) => resolve(dummyInvites[0]));

    component.addMember();
    expect(modalServiceSpy).toHaveBeenCalled();
  })

  it('should throw on "editMember" - not yet implemented', () => {
    let exception: any = null;
    try {
      component.editMember(1);
    } catch (e) {
      exception = e;
    } finally {
      expect(exception).toBeTruthy();
    }
  })

  it('should throw on "editInvite" - not yet implemented', () => {
    let exception: any = null;
    try {
      component.editInvite(0);
    } catch (e) {
      exception = e;
    } finally {
      expect(exception).toBeTruthy();
    }
  })

  it('should throw on "deleteInvite" - not yet implemented', () => {
    let exception: any = null;
    try {
      component.deleteInvite(0);
    } catch (e) {
      exception = e;
    } finally {
      expect(exception).toBeTruthy();
    }
  })

  it('should delete a membership', () => {
    authoringApiServiceMock.organizationMembershipService.deleteOrganizationMembership
      .and.returnValue(of({} as IBackendMessage));

    component.deleteMember(dummyOrganizationMembership.id);
    expect(authoringApiServiceMock.organizationMembershipService.deleteOrganizationMembership).toHaveBeenCalled();
  });

  it('should show a modal for creating a member invitation', () => {
    let modalMock = new NgbModalRefMock();
    let modalService = TestBed.inject(NgbModal)
    const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
    modalMock.result = new Promise((resolve) => resolve(dummyOrganizationMembership));

    clickElement(fixture, '#addMemberButton');

    expect(modalServiceSpy).toHaveBeenCalled();
  });
});
