import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { IQuestionnaire, IQuestionnaireBase } from 'src/app/core/models/questionnaire';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { dummyQuestionnaire, dummyCourse } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, setHTMLInputValue, spyOnGetter } from 'src/testutils/utils';

import { SaveQuestionnaireModalComponent } from './save-questionnaire-modal.component';

describe('SaveQuestionnaireModalComponent', () => {
  let component: SaveQuestionnaireModalComponent;
  let fixture: ComponentFixture<SaveQuestionnaireModalComponent>;

  const formTests = [
    { 
      description: 'submit should be disabled if values are empty',
      formValues: [
        { name: 'input[formControlName=title]', value: '' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    { 
      description: 'submit should be enabled if form is valid',
      formValues: [
        { name: 'input[formControlName=title]', value: 'valid' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveQuestionnaireModalComponent],
      imports: [ReactiveFormsModule, FontAwesomeIconsModuleMock],
      providers: [
        FormBuilder, 
        NgbActiveModal,
        { provide: AuthoringApiService, useValue: authoringApiServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveQuestionnaireModalComponent);
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
  
  it('should create a new questionnaire and close', () => {

    const dummyQuestionnaire: IQuestionnaireBase = {  
      title: 'test',
      chapter: null
    }

    component.course = dummyCourse;

    const addQuestionnaireSpy = authoringApiServiceMock.questionnaireService.addQuestionnaire.and.returnValue(of(dummyQuestionnaire as IQuestionnaire));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=title]', dummyQuestionnaire.title);
    
    const saveQuestionnaireSpy = spyOn(component, 'saveQuestionnaire').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveQuestionnaireSpy).toHaveBeenCalled();
    expect(addQuestionnaireSpy).toHaveBeenCalledWith(dummyCourse, dummyQuestionnaire);
    
    expect(closeSpy).toHaveBeenCalledWith(dummyQuestionnaire);
  });


  it('should prefill formData from an existing questionnaire', () => {    
    component.questionnaire = dummyQuestionnaire;

    expect(getHTMLElement(fixture, 'input[formControlName=title]').value).toEqual(dummyQuestionnaire.title)
  });

  it('should edit an existing questionnaire and close', () => {

    let modifiedDummyQuestionnaire: IQuestionnaire = {
      title: dummyQuestionnaire.title,
      id: dummyQuestionnaire.id,
      course: dummyCourse.id,
      chapter: null
    }
    
    const modifyQuestionnaireSpy = authoringApiServiceMock.questionnaireService.modifyQuestionnaire.and.returnValue(of(modifiedDummyQuestionnaire));
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.questionnaire = dummyQuestionnaire;

    setHTMLInputValue(fixture, 'input[formControlName=title]', modifiedDummyQuestionnaire.title)

    const saveQuestionnaireSpy = spyOn(component, 'saveQuestionnaire').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    fixture.detectChanges();

    expect(saveQuestionnaireSpy).toHaveBeenCalled();
    expect(modifyQuestionnaireSpy).toHaveBeenCalledWith(modifiedDummyQuestionnaire);
    expect(closeSpy).toHaveBeenCalledWith(modifiedDummyQuestionnaire);
  });
});
