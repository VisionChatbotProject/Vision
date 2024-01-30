import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberTableComponent } from './member-table.component';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { dummyOrganizationMemberships } from 'src/testutils/object-mocks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { HttpClientModule } from '@angular/common/http';
import { mockPipe } from 'src/testutils/pipe-mocks';
import { By } from '@angular/platform-browser';
import { clickElement } from 'src/testutils/utils';

describe('MemberTableComponent', () => {
  let component: MemberTableComponent;
  let fixture: ComponentFixture<MemberTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, TableModule],
      declarations: [MemberTableComponent, mockPipe({'name': 'orgRole'}, '<org role>')],
      providers: [
        { provide: NgbModal },
        { provide: AuthoringApiService, use: authoringApiServiceMock },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberTableComponent);
    component = fixture.componentInstance;
    component.memberships = dummyOrganizationMemberships,
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should emit "delete" with the memberId of the member when "deleteMember" is clicked', () => {
    const memberId: number = 1;
    const deleteMemberSpy = spyOn(component.deleteMember, "emit");
    const btnId: string = `#btn-deleteMembership-${memberId}`;
    
    const btn = fixture.debugElement.query(By.css(btnId));
    expect(btn).toBeTruthy();
    btn.triggerEventHandler('confirm', {});
    
    fixture.detectChanges();

    expect(deleteMemberSpy).toHaveBeenCalledWith(memberId);
  });

  xit('should emit "edit" with the memberId of the member when "editMember" is clicked', () => {
    const memberId: number = 1;
    const editMemberSpy = spyOn(component.editMember, "emit");
    const btnId: string = `#btn-editMembership-${memberId}`;

    clickElement(fixture, btnId);

    expect(editMemberSpy).toHaveBeenCalledWith(memberId);
  })
});
