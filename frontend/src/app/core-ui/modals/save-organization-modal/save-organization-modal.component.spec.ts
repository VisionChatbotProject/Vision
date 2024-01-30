import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ELanguage } from 'src/app/core/models/base';
import { IOrganization, IOrganizationBase } from 'src/app/core/models/organization';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { dummyOrganization } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';

import { clickElement, getHTMLElement, setHTMLInputValue } from 'src/testutils/utils';
import { SaveOrganizationModal } from './save-organization-modal.component';

describe('SaveOrganizationModal', () => {
  let component: SaveOrganizationModal;
  let fixture: ComponentFixture<SaveOrganizationModal>;

  const formTests = [
    { 
      description: 'submit should be disabled if url does not start with http(s)://',
      formValues: [
        { name: 'input[formControlName=name]', value: 'Test Organization' },
        { name: 'input[formControlName=url]', value: 'test-organization.com' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    { 
      description: 'submit should be enabled if url is correct and starts with http://',
      formValues: [
        { name: 'input[formControlName=name]', value: 'Test Organization' },
        { name: 'input[formControlName=url]', value: 'http://test-organization.com' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    },
    { 
      description: 'submit should be enabled if url is correct and starts with https://',
      formValues: [
        { name: 'input[formControlName=name]', value: 'Test Organization' },
        { name: 'input[formControlName=url]', value: 'https://test-organization.com' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveOrganizationModal ],
      imports: [FormsModule, ReactiveFormsModule, FontAwesomeIconsModuleMock],
      providers: [
        FormBuilder,
        NgbActiveModal,
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SaveOrganizationModal);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveOrganizationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  formTests.forEach(tc => {
    it(tc.description, () => {
      tc.formValues.forEach(formElement => {
        setHTMLInputValue(fixture, formElement.name, formElement.value)
      });

      expect(getHTMLElement(fixture, tc.expected.item)[tc.expected.property]).toEqual(tc.expected.value);
    });
  })

  it('should create a new organization and close', () => {
    const newOrganization: IOrganizationBase = {
      name: "my_new_organization",
      url: "http://my-organization.com",
      language: ELanguage.eEnglish
    };

    const addOrganizationSpy = authoringApiServiceMock.organizationService.addOrganization.and.returnValue(of(newOrganization as IOrganization));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=name]', newOrganization.name);
    setHTMLInputValue(fixture, 'input[formControlName=url]', newOrganization.url);
    
    const saveOrganizationSpy = spyOn(component, 'saveOrganization').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveOrganizationSpy).toHaveBeenCalled();
    expect(addOrganizationSpy).toHaveBeenCalledWith(newOrganization);
    expect(closeSpy).toHaveBeenCalledWith(newOrganization);
  });

  it('should prefill formData from an existing organization', () => {
    expect(getHTMLElement(fixture, 'input[formControlName=name]').value).toEqual('');
    expect(getHTMLElement(fixture, 'input[formControlName=url]').value).toEqual('https://');

    component.organization = dummyOrganization;

    expect(getHTMLElement(fixture, 'input[formControlName=name]').value).toEqual(dummyOrganization.name);
    expect(getHTMLElement(fixture, 'input[formControlName=url]').value).toEqual(dummyOrganization.url);
  });

  it('should edit an existing organization and close', () => {
    const modifiedOrganization: IOrganization = {
      id: dummyOrganization.id,
      name: "some-new-name",
      url: dummyOrganization.url,
      language: dummyOrganization.language,
      createdBy: dummyOrganization.createdBy
    }

    const modifyOrganizationSpy = authoringApiServiceMock.organizationService.modifyOrganization.and.returnValue(of(modifiedOrganization));
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.organization = dummyOrganization;

    setHTMLInputValue(fixture, 'input[formControlName=name]', modifiedOrganization.name);

    const saveOrganizationSpy = spyOn(component, 'saveOrganization').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveOrganizationSpy).toHaveBeenCalled();
    expect(modifyOrganizationSpy).toHaveBeenCalledWith(modifiedOrganization);
    expect(closeSpy).toHaveBeenCalledWith(modifiedOrganization);
  });

  it('should disable the "create organization" button if the form is invalid', waitForAsync(() => {
    fixture.whenStable().then(() => {
      setHTMLInputValue(fixture, '#url', 'invalidUrl');
      let button = getHTMLElement(fixture, '#createOrganizationButton');
      expect(button.disabled).toBeTruthy();
    });
  }));
});
