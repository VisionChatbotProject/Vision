import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InviteMemberModalComponent } from './invite-member-modal.component';
import { clickElement, getHTMLElement, setHTMLInputValue, spyOnGetter } from 'src/testutils/utils';
import { dummyOrganization, dummyOrganizationRoles } from 'src/testutils/object-mocks';
import { IOrganizationRole } from 'src/app/core/models/organization_role';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { IInvite, IInviteBase } from 'src/app/core/models/invite';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('InviteMemberModalComponent', () => {
  let component: InviteMemberModalComponent;
  let fixture: ComponentFixture<InviteMemberModalComponent>;
  let activeModal: NgbActiveModal

  const formTests = [
    { 
      description: 'submit should be disabled if values are empty',
      formValues: [
        { name: 'input[formControlName=email]', value: '' },
        { name: 'input[formControlName=firstName]', value: '' },
        { name: 'input[formControlName=lastName]', value: '' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    { 
      description: 'submit should be disabled if email is incorrect',
      formValues: [
        { name: 'input[formControlName=email]', value: 'john.com' },
        { name: 'input[formControlName=firstName]', value: 'john' },
        { name: 'input[formControlName=lastName]', value: 'doe' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    { 
      description: 'submit should be enabled if form is valid',
      formValues: [
        { name: 'input[formControlName=email]', value: 'john-doe@test.com' },
        { name: 'input[formControlName=firstName]', value: 'john' },
        { name: 'input[formControlName=lastName]', value: 'doe' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMemberModalComponent ],
      imports: [FormsModule, ReactiveFormsModule, FontAwesomeIconsModuleMock],
      providers: [
        { provide: FormBuilder },
        { provide: NgbActiveModal },
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents()
    .then((res) => {
      fixture = TestBed.createComponent(InviteMemberModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      activeModal = TestBed.inject(NgbActiveModal);
    });
  });

  beforeEach(() => {
    spyOnGetter(authoringApiServiceMock.contextService, 'activeOrganization').and.returnValue(dummyOrganization);

    fixture = TestBed.createComponent(InviteMemberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    activeModal = TestBed.inject(NgbActiveModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  formTests.forEach(tc => {
    it(tc.description, () => {
      component.roles = dummyOrganizationRoles
      tc.formValues.forEach(formElement => {
        setHTMLInputValue(fixture, formElement.name, formElement.value)
      });

      expect(getHTMLElement(fixture, tc.expected.item)[tc.expected.property]).toEqual(tc.expected.value);
    });
  })

  it('should disable the "send Invitation" button if the form is invalid', () => {
      setHTMLInputValue(fixture, '#email', 'invalidEmail');
      let button = getHTMLElement(fixture, '#inviteMemberButton');
      expect(button.disabled).toBeTruthy();
  });

  it('should create a new invite and close', () => {

    let dummyInvite: IInviteBase = {
      email: 'john-doe@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 1
    }

    component.roles = dummyOrganizationRoles

    const addInviteSpy = authoringApiServiceMock.inviteService.addInvite.and.returnValue(of(dummyInvite as IInvite));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=email]', dummyInvite.email);
    setHTMLInputValue(fixture, 'input[formControlName=firstName]', dummyInvite.firstName);
    setHTMLInputValue(fixture, 'input[formControlName=lastName]', dummyInvite.lastName);

    const createInviteSpy = spyOn(component, 'createInvite').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(createInviteSpy).toHaveBeenCalled();
    expect(addInviteSpy).toHaveBeenCalledWith(dummyOrganization, dummyInvite);
    expect(closeSpy).toHaveBeenCalledWith(dummyInvite);

  });

});
