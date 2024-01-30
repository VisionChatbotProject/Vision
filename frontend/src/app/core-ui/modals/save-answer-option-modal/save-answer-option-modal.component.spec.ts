import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { SaveAnswerOptionModalComponent } from './save-answer-option-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, setHTMLInputValue } from 'src/testutils/utils';
import { IAnswerOption, IAnswerOptionBase } from 'src/app/core/models/answer_options';
import { dummyAnswerOption, dummyQuestion } from 'src/testutils/object-mocks';
import { of } from 'rxjs';

describe('SaveAnswerOptionModalComponent', () => {
  let component: SaveAnswerOptionModalComponent;
  let fixture: ComponentFixture<SaveAnswerOptionModalComponent>;

  const formTests = [
    {
      description: 'submit should be disabled if values are empty',
      formValues: [
        { name: 'input[formControlName=text]', value: '' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    {
      description: 'submit should be enabled if form is valid',
      formValues: [
        { name: 'input[formControlName=text]', value: 'valid' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveAnswerOptionModalComponent],
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
    fixture = TestBed.createComponent(SaveAnswerOptionModalComponent);
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

  it('should create a new answer option and close', () => {

    const dummyAnswerOption: IAnswerOptionBase = {
      text: 'test',
      resourcetype: 'AnswerOption',
      asset: '',
      correctAnswer: false,
    }

    component.question = dummyQuestion;

    const addAnswerOptionSpy = authoringApiServiceMock.answerOptionService.addAnswerOption.and.returnValue(of(dummyAnswerOption as IAnswerOption));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=text]', dummyAnswerOption.text!);

    const saveAnswerOptionSpy = spyOn(component, 'saveAnswerOption').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveAnswerOptionSpy).toHaveBeenCalled();
    expect(addAnswerOptionSpy).toHaveBeenCalledWith(dummyQuestion, dummyAnswerOption);

    expect(closeSpy).toHaveBeenCalledWith(dummyAnswerOption);
  });


  it('should prefill formData from an existing answer option', () => {
    component.answerOption = dummyAnswerOption;

    expect(getHTMLElement(fixture, 'input[formControlName=text]').value).toEqual(dummyAnswerOption.text)
  });

  it('should edit an existing answer option and close', () => {

    let modifiedDummyAnswerOption: IAnswerOption = {
      text: 'new description',
      resourcetype: 'AnswerOption',
      id: dummyAnswerOption.id,
      question: dummyAnswerOption.question,
      asset: '',
      correctAnswer: false,
      createdAt: '',
      createdBy: 0,
      updatedAt: '',
      updatedBy: 0,
    }

    const modifyAnswerOptionSpy = authoringApiServiceMock.answerOptionService.modifyAnswerOption.and.returnValue(of(modifiedDummyAnswerOption));
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.answerOption = dummyAnswerOption;

    setHTMLInputValue(fixture, 'input[formControlName=text]', modifiedDummyAnswerOption.text!)

    const saveAnswerOptionSpy = spyOn(component, 'saveAnswerOption').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    fixture.detectChanges();

    expect(saveAnswerOptionSpy).toHaveBeenCalled();
    expect(modifyAnswerOptionSpy).toHaveBeenCalledWith(modifiedDummyAnswerOption);
    expect(closeSpy).toHaveBeenCalledWith(modifiedDummyAnswerOption);
  });
});
