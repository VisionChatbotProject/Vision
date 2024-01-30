import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { dummyCourse, dummyCourses } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, spyOnGetter } from 'src/testutils/utils';

import { CourseTableComponent } from './course-table.component';
import { TableModule } from 'primeng/table';
import { ImgSrcDirective } from 'src/app/core/directives/img-src/img-src.directive';
import { NgbModalRefMock } from 'src/testutils/component-mocks';
import { By } from '@angular/platform-browser';
import { ICourse } from 'src/app/core/models/course';
import { HttpResponse } from '@angular/common/http';

describe('CourseTableComponent', () => {
  let component: CourseTableComponent;
  let fixture: ComponentFixture<CourseTableComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseTableComponent, ImgSrcDirective],
      imports: [RouterTestingModule, FontAwesomeIconsModuleMock, TableModule],
      providers: [
        {provide: AuthoringApiService, useValue: authoringApiServiceMock},
        { provide: NgbModal }
      ]
    })
    .compileComponents();
  });

  describe('with courses', () => {
    beforeEach(() => {
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses);

      fixture = TestBed.createComponent(CourseTableComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should change route if the course open button is clicked', () => {

      const courseId: number = dummyCourses[0].id;

      let openCourseSpy = spyOn(component, 'openCourse').and.callThrough();
      let navigateSpy = spyOn(router, 'navigate');

      clickElement(fixture, '#openCourse-' + courseId);
        
      expect(openCourseSpy).toHaveBeenCalledWith(courseId);
      expect(navigateSpy).toHaveBeenCalled();
    });

  });

  describe('w/o courses', () => {
    beforeEach(() => {
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue([]);

      fixture = TestBed.createComponent(CourseTableComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should show a prominent "add" button and a header', () => {
      expect(getHTMLElement(fixture, '#noCoursesDescription')).toBeTruthy();
      expect(getHTMLElement(fixture, '#addCourseButton')).toBeTruthy();
    });

    it('should show a modal for adding a course and reload them', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal)
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef)
      modalMock.result = new Promise((resolve, reject) => resolve(dummyCourse));

      clickElement(fixture, '#addCourseButton');

      expect(modalServiceSpy).toHaveBeenCalled();
    });

  });
});
