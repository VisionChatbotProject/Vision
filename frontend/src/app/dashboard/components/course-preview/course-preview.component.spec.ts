import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ICourse } from 'src/app/core/models/course';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { PanelToggleMock } from 'src/testutils/component-mocks';
import { ImgSrcDirectiveMock } from 'src/testutils/directive-mocks';
import { dummyCourse } from 'src/testutils/object-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';
import { CoursePreviewComponent } from './course-preview.component';


describe('CoursePreviewComponent', () => {
  let component: CoursePreviewComponent;
  let fixture: ComponentFixture<CoursePreviewComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursePreviewComponent, PanelToggleMock, ImgSrcDirectiveMock],
      imports: [RouterTestingModule, FontAwesomeIconsModuleMock]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePreviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take a course as input', () => {
    let course : ICourse = dummyCourse;
    component.course = course;
    fixture.detectChanges();
    let courseTitleElement = getHTMLElement(fixture, '#courseTitle');
    expect(courseTitleElement.innerHTML).toContain(course.name);
  });

  it('should open a course when the button is clicked', () => {
    let course : ICourse = dummyCourse;
    component.course = course;
    fixture.detectChanges();

    let openChapterSpy = spyOn(component, 'openCourse').and.callThrough();
    let navigateSpy = spyOn(router, 'navigate');
    clickElement(fixture, '#btn-openCourse');
    expect(openChapterSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['main/courses/course'], jasmine.any(Object));
  });

  
});
