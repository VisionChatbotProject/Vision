import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ICourse, ICourseBase } from 'src/app/core/models/course';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { ImageChooserMock } from 'src/testutils/component-mocks';
import { dummyCourse, dummyOrganization } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import {
  clickElement,
  getHTMLElement,
  setHTMLInputValue,
  spyOnGetter,
} from 'src/testutils/utils';

import { SaveCourseModalComponent } from './save-course-modal.component';

describe('SaveCourseModalComponent', () => {
  let component: SaveCourseModalComponent;
  let fixture: ComponentFixture<SaveCourseModalComponent>;

  const formTests = [
    {
      description: 'submit should be disabled if values are empty',
      formValues: [
        { name: 'input[formControlName=shortDescription]', value: '' },
        { name: 'textArea[formControlName=longDescription]', value: '' },
        { name: 'input[formControlName=name]', value: '' },
      ],
      expected: {
        item: 'button[type=submit]',
        property: 'disabled',
        value: true,
      },
    },
    {
      description: 'submit should be disabled if shortDescription is too long',
      formValues: [
        {
          name: 'input[formControlName=shortDescription]',
          value: new Array(260).join('X'),
        },
        { name: 'textArea[formControlName=longDescription]', value: 'valid' },
        { name: 'input[formControlName=name]', value: 'valid' },
      ],
      expected: {
        item: 'button[type=submit]',
        property: 'disabled',
        value: true,
      },
    },
    {
      description: 'submit should be enabled if form is valid',
      formValues: [
        { name: 'input[formControlName=shortDescription]', value: 'valid' },
        { name: 'textArea[formControlName=longDescription]', value: 'valid' },
        { name: 'input[formControlName=name]', value: 'valid' },
      ],
      expected: {
        item: 'button[type=submit]',
        property: 'disabled',
        value: true,
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveCourseModalComponent, ImageChooserMock],
      imports: [ReactiveFormsModule, FontAwesomeIconsModuleMock],
      providers: [
        FormBuilder,
        NgbActiveModal,
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    spyOnGetter(
      authoringApiServiceMock.contextService,
      'activeOrganization'
    ).and.returnValue(dummyOrganization);

    fixture = TestBed.createComponent(SaveCourseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  formTests.forEach((tc) => {
    it(tc.description, () => {
      tc.formValues.forEach((formElement) => {
        setHTMLInputValue(fixture, formElement.name, formElement.value);
      });

      expect(
        getHTMLElement(fixture, tc.expected.item)[tc.expected.property]
      ).toEqual(tc.expected.value);
    });
  });

  it('should create a new course without an image and close', () => {
    let dummyCourse: ICourseBase = {
      image: '',
      longDescription: 'Some Description',
      shortDescription: 'description',
      name: 'test',
      teacherName: 'dummy test teacher',
      teacherEmail: 'teach@smartauthoring.com',
      courseBeginDate: '2023-02-10T09:00',
      courseEndDate: '2023-02-19T09:00',
      materials: 'some materials',
      ressources: 'https://smartauthoring.com/test/test.pdf',
    };

    const addCourseSpy =
      authoringApiServiceMock.courseService.addCourse.and.returnValue(
        of(dummyCourse as ICourse)
      );
    const closeSpy = spyOn(component['_activeModal'], 'close');

    setHTMLInputValue(fixture, 'input[formControlName=name]', dummyCourse.name);
    setHTMLInputValue(fixture, 'input[formControlName=shortDescription]', dummyCourse.shortDescription);
    setHTMLInputValue(fixture, 'textarea[formControlName=longDescription]', dummyCourse.longDescription);
    setHTMLInputValue(fixture, 'input[formControlName=teacherName]', dummyCourse.teacherName);
    setHTMLInputValue(fixture, 'input[formControlName=teacherEmail]', dummyCourse.teacherEmail);
    setHTMLInputValue(fixture, 'input[formControlName=courseBeginDate]', dummyCourse.courseBeginDate);
    setHTMLInputValue(fixture, 'input[formControlName=courseEndDate]', dummyCourse.courseEndDate);
    setHTMLInputValue(fixture, 'textarea[formControlName=materials]', dummyCourse.materials);
    setHTMLInputValue(fixture, 'textarea[formControlName=ressources]', dummyCourse.ressources);

    const saveCourseSpy = spyOn(component, 'saveCourse').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveCourseSpy).toHaveBeenCalled();
    expect(addCourseSpy).toHaveBeenCalledWith(dummyOrganization, dummyCourse);
    expect(closeSpy).toHaveBeenCalledWith(dummyCourse);
  });

  it('should create a new course with an image and close', () => {
    let dummyCourse: ICourseBase = {
      image: new Blob(['test']),
      longDescription: 'Some Description',
      shortDescription: 'description',
      name: 'test',
      teacherName: 'dummy test teacher',
      teacherEmail: 'teach@smartauthoring.com',
      courseBeginDate: '2023-02-10T09:00',
      courseEndDate: '2023-02-19T09:00',
      materials: 'some materials',
      ressources: 'https://smartauthoring.com/test/test.pdf',
    };

    const addCourseSpy =
      authoringApiServiceMock.courseService.addCourse.and.returnValue(
        of(dummyCourse as ICourse)
      );
    const closeSpy = spyOn(component['_activeModal'], 'close');

    setHTMLInputValue(fixture, 'input[formControlName=name]', dummyCourse.name);
    setHTMLInputValue(fixture, 'input[formControlName=shortDescription]', dummyCourse.shortDescription);
    setHTMLInputValue(fixture, 'textarea[formControlName=longDescription]', dummyCourse.longDescription);
    setHTMLInputValue(fixture, 'input[formControlName=teacherName]', dummyCourse.teacherName);
    setHTMLInputValue(fixture, 'input[formControlName=teacherEmail]', dummyCourse.teacherEmail);
    setHTMLInputValue(fixture, 'input[formControlName=courseBeginDate]', dummyCourse.courseBeginDate);
    setHTMLInputValue(fixture, 'input[formControlName=courseEndDate]', dummyCourse.courseEndDate);
    setHTMLInputValue(fixture, 'textarea[formControlName=materials]', dummyCourse.materials);
    setHTMLInputValue(fixture, 'textarea[formControlName=ressources]', dummyCourse.ressources);
    component.image = {
      url: 'http://someImage.png',
      data: dummyCourse.image as Blob,
    };

    const saveCourseSpy = spyOn(component, 'saveCourse').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    fixture.detectChanges();

    expect(saveCourseSpy).toHaveBeenCalled();
    expect(addCourseSpy).toHaveBeenCalledWith(dummyOrganization, dummyCourse);
    expect(closeSpy).toHaveBeenCalledWith(dummyCourse);
  });

  it('should prefill formData from an existing course', () => {
    component.course = dummyCourse;

    expect(
      getHTMLElement(fixture, 'input[formControlName=name]').value
    ).toEqual(dummyCourse.name);
    expect(
      getHTMLElement(fixture, 'input[formControlName=shortDescription]').value
    ).toEqual(dummyCourse.shortDescription);
    expect(
      getHTMLElement(fixture, 'textarea[formControlName=longDescription]').value
    ).toEqual(dummyCourse.longDescription);
    expect(component.image.url).toEqual(dummyCourse.image as string);
  });

  it('should edit an existing course without a new image and close', () => {
    let modifiedDummyCourse: ICourse = {
      image: dummyCourse.image,
      longDescription: 'Some Description',
      shortDescription: 'description',
      name: 'test',
      id: dummyCourse.id,
      teacherName: 'dummy modified teacher',
      teacherEmail: 'teach@smartauthoring.com',
      courseBeginDate: '2023-02-10T09:00',
      courseEndDate: '2023-02-19T09:00',
      materials: 'some modified materials',
      ressources: 'https://smartauthoring.com/test/test.pdf',
    };

    const modifyCourseSpy =
      authoringApiServiceMock.courseService.modifyCourse.and.returnValue(
        of(modifiedDummyCourse as ICourse)
      );
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.course = dummyCourse;

    setHTMLInputValue(fixture, 'input[formControlName=name]', modifiedDummyCourse.name);
    setHTMLInputValue(fixture, 'input[formControlName=shortDescription]', modifiedDummyCourse.shortDescription);
    setHTMLInputValue(fixture, 'textarea[formControlName=longDescription]', modifiedDummyCourse.longDescription);
    setHTMLInputValue(fixture, 'input[formControlName=teacherName]', modifiedDummyCourse.teacherName);
    setHTMLInputValue(fixture, 'input[formControlName=teacherEmail]', modifiedDummyCourse.teacherEmail);
    setHTMLInputValue(fixture, 'input[formControlName=courseBeginDate]', modifiedDummyCourse.courseBeginDate);
    setHTMLInputValue(fixture, 'input[formControlName=courseEndDate]', modifiedDummyCourse.courseEndDate);
    setHTMLInputValue(fixture, 'textarea[formControlName=materials]', modifiedDummyCourse.materials);
    setHTMLInputValue(fixture, 'textarea[formControlName=ressources]', modifiedDummyCourse.ressources);

    const saveCourseSpy = spyOn(component, 'saveCourse').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    expect(saveCourseSpy).toHaveBeenCalled();
    expect(modifyCourseSpy).toHaveBeenCalledWith(modifiedDummyCourse);
    expect(closeSpy).toHaveBeenCalledWith(modifiedDummyCourse);
  });

  it('should edit an existing course with a new image and close', () => {
    let modifiedDummyCourse: ICourse = {
      image: new Blob(['test']),
      longDescription: 'Some Description',
      shortDescription: 'description',
      name: 'test',
      id: dummyCourse.id,
      teacherName: 'dummy modified teacher',
      teacherEmail: 'teach@smartauthoring.com',
      courseBeginDate: '2023-02-10T09:00',
      courseEndDate: '2023-02-19T09:00',
      materials: 'some modified materials',
      ressources: 'https://smartauthoring.com/test/test.pdf',
    };

    const modifyCourseSpy =
      authoringApiServiceMock.courseService.modifyCourse.and.returnValue(
        of(modifiedDummyCourse as ICourse)
      );
    const closeSpy = spyOn(component['_activeModal'], 'close');

    component.course = dummyCourse;

    setHTMLInputValue(fixture, 'input[formControlName=name]', modifiedDummyCourse.name);
    setHTMLInputValue(fixture, 'input[formControlName=shortDescription]', modifiedDummyCourse.shortDescription);
    setHTMLInputValue(fixture, 'textarea[formControlName=longDescription]', modifiedDummyCourse.longDescription);
    setHTMLInputValue(fixture, 'input[formControlName=teacherName]', modifiedDummyCourse.teacherName);
    setHTMLInputValue(fixture, 'input[formControlName=teacherEmail]', modifiedDummyCourse.teacherEmail);
    setHTMLInputValue(fixture, 'input[formControlName=courseBeginDate]', modifiedDummyCourse.courseBeginDate);
    setHTMLInputValue(fixture, 'input[formControlName=courseEndDate]', modifiedDummyCourse.courseEndDate);
    setHTMLInputValue(fixture, 'textarea[formControlName=materials]', modifiedDummyCourse.materials);
    setHTMLInputValue(fixture, 'textarea[formControlName=ressources]', modifiedDummyCourse.ressources);

    component.image = {
      url: 'http://someImage.png',
      data: modifiedDummyCourse.image as Blob,
    };

    const saveCourseSpy = spyOn(component, 'saveCourse').and.callThrough();
    clickElement(fixture, 'button[type=submit]');

    fixture.detectChanges();

    expect(saveCourseSpy).toHaveBeenCalled();
    expect(modifyCourseSpy).toHaveBeenCalledWith(modifiedDummyCourse);
    expect(closeSpy).toHaveBeenCalledWith(modifiedDummyCourse);
  });
});
