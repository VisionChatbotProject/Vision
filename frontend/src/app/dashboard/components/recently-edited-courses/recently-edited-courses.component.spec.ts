import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { CoursePreviewMock, NgbModalRefMock, PanelToggleMock } from 'src/testutils/component-mocks';
import { dummyCourse, dummyCourses } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement, spyOnGetter } from 'src/testutils/utils';

import { RecentlyEditedCoursesComponent } from './recently-edited-courses.component';

describe('RecentlyEditedCoursesComponent', () => {
  let component: RecentlyEditedCoursesComponent;
  let fixture: ComponentFixture<RecentlyEditedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentlyEditedCoursesComponent, PanelToggleMock, CoursePreviewMock],
      imports: [NgbAccordionModule, FormsModule, ReactiveFormsModule, FontAwesomeIconsModuleMock],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal }
      ]
    })
    .compileComponents();
  });

  describe('w/o courses', () => {

    beforeEach(() => {
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue([])

      fixture = TestBed.createComponent(RecentlyEditedCoursesComponent);
      component = fixture.componentInstance;
      
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

  });

  describe('with courses', () => {

    beforeEach(() => {
      spyOnGetter(authoringApiServiceMock.contextService, 'courses').and.returnValue(dummyCourses)
      fixture = TestBed.createComponent(RecentlyEditedCoursesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return courses in a sorted order', () => {
      const sortedCourses = dummyCourses.sort((l, r) => <any>r.modifiedAt! - <any>l.modifiedAt!)
      component.courses.forEach((e, i) => {
          if(i > 0) { expect(e.modifiedAt! <= sortedCourses[i-1].modifiedAt!).toBeTrue(); }
      });
    });
  });

});
