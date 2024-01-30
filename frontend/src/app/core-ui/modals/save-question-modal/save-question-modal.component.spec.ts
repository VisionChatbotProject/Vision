import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { IQuestion, IQuestionBase } from 'src/app/core/models/question';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { dummyQuestion, dummyQuestionnaire } from 'src/testutils/object-mocks';

import { clickElement, getHTMLElement, setHTMLInputValue } from 'src/testutils/utils';
import { SaveQuestionModalComponent } from './save-question-modal.component';

describe('SaveQuestionModalComponent', () => {
  let component: SaveQuestionModalComponent;
  let fixture: ComponentFixture<SaveQuestionModalComponent>;

  const formTests = [
    { 
      description: 'submit should be disabled if values are empty',
      formValues: [
        { name: 'input[formControlName=title]', value: '' },
        { name: 'input[formControlName=text]', value: '' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    { 
      description: 'submit should be enabled if form is valid',
      formValues: [
        { name: 'input[formControlName=title]', value: 'valid' },
        { name: 'input[formControlName=text]', value: 'valid' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveQuestionModalComponent],
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
    fixture = TestBed.createComponent(SaveQuestionModalComponent);
    component = fixture.componentInstance;
    component.questionnaire = dummyQuestionnaire;
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

  it('should create a new question and close', () => {
    const newQuestion: IQuestionBase = {
      title: "my_new_question",
      questionnaire: 0,
      text: 'my_new_description',
      asset: '',
      resourcetype: 'ChoiceQuestion'
    };

    const addQuestionSpy = authoringApiServiceMock.questionService.addQuestion.and.returnValue(of(newQuestion as IQuestion));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=title]', newQuestion.title);
    setHTMLInputValue(fixture, 'input[formControlName=text]', newQuestion.text);
    
    const saveQuestionSpy = spyOn(component, 'saveQuestion').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveQuestionSpy).toHaveBeenCalled();
    expect(addQuestionSpy).toHaveBeenCalledWith(dummyQuestionnaire, newQuestion); 
    expect(closeSpy).toHaveBeenCalledWith(newQuestion);
  });

  it('should prefill formData from an existing question', () => {
    expect(getHTMLElement(fixture, 'input[formControlName=title]').value).toEqual('');
    expect(getHTMLElement(fixture, 'input[formControlName=text]').value).toEqual('');

    component.question = dummyQuestion;

    expect(getHTMLElement(fixture, 'input[formControlName=title]').value).toEqual(dummyQuestion.title);
    expect(getHTMLElement(fixture, 'input[formControlName=text]').value).toEqual(dummyQuestion.text);
  });

  it('should edit an existing question and close', () => {
    const modifiedQuestion: IQuestion = {
      id: dummyQuestion.id,
      title: "some-new-title",
      questionnaire: dummyQuestion.questionnaire,
      text: '',
      asset: '',
      createdAt: '',
      createdBy: 0,
      resourcetype: 'ChoiceQuestion',
      updatedAt: '',
      updatedBy: 0,
    }

    const modifyQuestionSpy = authoringApiServiceMock.questionService.modifyQuestion.and.returnValue(of(modifiedQuestion));
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.question = dummyQuestion;

    setHTMLInputValue(fixture, 'input[formControlName=title]', modifiedQuestion.title);
    setHTMLInputValue(fixture, 'input[formControlName=text]', modifiedQuestion.text);

    const saveQuestionSpy = spyOn(component, 'saveQuestion').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveQuestionSpy).toHaveBeenCalled();
    expect(modifyQuestionSpy).toHaveBeenCalledWith(modifiedQuestion);
    expect(closeSpy).toHaveBeenCalledWith(modifiedQuestion);
  });

  it('should disable the "create question" button if the form is invalid', waitForAsync(() => {
    fixture.whenStable().then(() => {
      setHTMLInputValue(fixture, '#title', '');
      let button = getHTMLElement(fixture, '#createQuestionButton');
      expect(button.disabled).toBeTruthy();
    });
  }));
});
