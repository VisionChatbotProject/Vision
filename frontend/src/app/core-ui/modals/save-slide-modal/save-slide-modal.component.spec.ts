import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ISlide, ISlideBase } from 'src/app/core/models/slide';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { dummyChapter, dummySlide } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, setHTMLInputValue } from 'src/testutils/utils';

import { SaveSlideModalComponent } from './save-slide-modal.component';

describe('SaveSlideModalComponent', () => {
  let component: SaveSlideModalComponent;
  let fixture: ComponentFixture<SaveSlideModalComponent>;

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
      declarations: [SaveSlideModalComponent],
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
    fixture = TestBed.createComponent(SaveSlideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  formTests.forEach(tc => {
    it(tc.description, () => {
      tc.formValues.forEach(formElement => { setHTMLInputValue(fixture, formElement.name, formElement.value) });
      expect(getHTMLElement(fixture, tc.expected.item)[tc.expected.property]).toEqual(tc.expected.value);
    });
  })
  
  it('should create a new slide and close', () => {

    const dummySlide: ISlideBase = { title: 'test', content: '' }

    component.chapter = dummyChapter;

    const addSlideSpy = authoringApiServiceMock.slideService.addSlide.and.returnValue(of(dummySlide as ISlide));
    const closeSpy = spyOn(component.activeModal, 'close');

    setHTMLInputValue(fixture, 'input[formControlName=title]', dummySlide.title)
    
    const saveSlideSpy = spyOn(component, 'saveSlide').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveSlideSpy).toHaveBeenCalled();
    expect(addSlideSpy).toHaveBeenCalledWith(dummyChapter, dummySlide);
    expect(closeSpy).toHaveBeenCalledWith(dummySlide);
  });


  it('should prefill formData from an existing slide', () => {    
    component.slide = dummySlide;

    expect(getHTMLElement(fixture, 'input[formControlName=title]').value).toEqual(dummySlide.title)
  });

  it('should edit an existing slide and close', () => {

    let modifiedDummySlide: ISlide = {
      title: 'a different Slide',
      id: dummySlide.id,
      content: dummySlide.content,
      order: dummySlide.order
    }
    
    const modifySlideSpy = authoringApiServiceMock.slideService.modifySlide.and.returnValue(of(modifiedDummySlide));
    const closeSpy = spyOn(component.activeModal, 'close');

    component.chapter = dummyChapter;
    component.slide = dummySlide;

    setHTMLInputValue(fixture, 'input[formControlName=title]', modifiedDummySlide.title)

    const saveSlideSpy = spyOn(component, 'saveSlide').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    fixture.detectChanges();

    expect(saveSlideSpy).toHaveBeenCalled();
    expect(modifySlideSpy).toHaveBeenCalledWith(modifiedDummySlide);
    expect(closeSpy).toHaveBeenCalledWith(modifiedDummySlide);
  });

});
