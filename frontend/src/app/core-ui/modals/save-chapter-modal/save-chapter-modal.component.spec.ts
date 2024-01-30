import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { IChapter, IChapterBase } from 'src/app/core/models/chapter';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { dummyChapter, dummyCourse } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, setHTMLInputValue, spyOnGetter } from 'src/testutils/utils';

import { SaveChapterModalComponent } from './save-chapter-modal.component';

describe('SaveChapterModalComponent', () => {
  let component: SaveChapterModalComponent;
  let fixture: ComponentFixture<SaveChapterModalComponent>;

  const formTests = [
    {
      description: 'submit should be disabled if values are empty',
      formValues: [
        { name: 'input[formControlName=shortDescription]', value: '' },
        { name: 'textArea[formControlName=longDescription]', value: '' },
        { name: 'input[formControlName=title]', value: '' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    {
      description: 'submit should be disabled if shortDescription is too long',
      formValues: [
        { name: 'input[formControlName=shortDescription]', value: new Array(110).join('X') },
        { name: 'textArea[formControlName=longDescription]', value: 'valid' },
        { name: 'input[formControlName=title]', value: 'valid' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: true }
    },
    {
      description: 'submit should be enabled if form is valid',
      formValues: [
        { name: 'input[formControlName=shortDescription]', value: 'valid' },
        { name: 'textArea[formControlName=longDescription]', value: 'valid' },
        { name: 'input[formControlName=title]', value: 'valid' }
      ],
      expected: { item: 'button[type=submit]', property: 'disabled', value: false }
    },
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveChapterModalComponent],
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
    fixture = TestBed.createComponent(SaveChapterModalComponent);
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

  it('should create a new chapter and close', () => {

    const dummyChapter: IChapterBase = {
      longDescription: 'Some Description',
      shortDescription: 'description',
      title: 'test'
    }

    component.course = dummyCourse;

    const addChapterSpy = authoringApiServiceMock.chapterService.addChapter.and.returnValue(of(dummyChapter as IChapter));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=title]', dummyChapter.title)
    setHTMLInputValue(fixture, 'input[formControlName=shortDescription]', dummyChapter.shortDescription)
    setHTMLInputValue(fixture, 'textarea[formControlName=longDescription]', dummyChapter.longDescription)

    const saveChapterSpy = spyOn(component, 'saveChapter').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveChapterSpy).toHaveBeenCalled();
    expect(addChapterSpy).toHaveBeenCalledWith(dummyCourse, dummyChapter);
    expect(closeSpy).toHaveBeenCalledWith(dummyChapter);
  });


  it('should prefill formData from an existing chapter', () => {
    component.chapter = dummyChapter;

    expect(getHTMLElement(fixture, 'input[formControlName=title]').value).toEqual(dummyChapter.title)
    expect(getHTMLElement(fixture, 'input[formControlName=shortDescription]').value).toEqual(dummyChapter.shortDescription)
    expect(getHTMLElement(fixture, 'textarea[formControlName=longDescription]').value).toEqual(dummyChapter.longDescription)
  });

  it('should edit an existing chapter and close', () => {

    let modifiedDummyChapter: IChapter = {
      longDescription: 'Some Description',
      shortDescription: 'description',
      title: 'test',
      id: dummyChapter.id,
      course: dummyCourse.id,
      order: 0,
    }

    const modifyChapterSpy = authoringApiServiceMock.chapterService.modifyChapter.and.returnValue(of(modifiedDummyChapter));
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.chapter = dummyChapter;

    setHTMLInputValue(fixture, 'input[formControlName=title]', modifiedDummyChapter.title)
    setHTMLInputValue(fixture, 'input[formControlName=shortDescription]', modifiedDummyChapter.shortDescription)
    setHTMLInputValue(fixture, 'textarea[formControlName=longDescription]', modifiedDummyChapter.longDescription)

    const saveChapterSpy = spyOn(component, 'saveChapter').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    fixture.detectChanges();

    expect(saveChapterSpy).toHaveBeenCalled();
    expect(modifyChapterSpy).toHaveBeenCalledWith(modifiedDummyChapter);
    expect(closeSpy).toHaveBeenCalledWith(modifiedDummyChapter);
  });
});
