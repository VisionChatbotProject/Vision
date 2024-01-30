import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbAccordionModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';
import { LoadingComponent } from 'src/app/core-ui/components/loading/loading.component';
import { AuthoringApiService } from 'src/app/core/services/authoringApi/authoring-api.service';
import { FontAwesomeIconsModuleMock } from 'src/testutils/built-in-mocks';
import { NgbModalRefMock } from 'src/testutils/component-mocks';
import { dummyChapter, dummyChapters, dummyCourse, dummyOrganization, dummySlide, dummySlides } from 'src/testutils/object-mocks';
import { authoringApiServiceMock } from 'src/testutils/service-mocks';
import { clickElement, getHTMLElement } from 'src/testutils/utils';

import { ChapterDetailComponent } from './chapter-detail.component';
import { SlideTableComponent } from './slide-table/slide-table.component';

describe('ChapterDetailComponent', () => {
  let component: ChapterDetailComponent;
  let fixture: ComponentFixture<ChapterDetailComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChapterDetailComponent, SlideTableComponent, LoadingComponent ],
      imports: [CommonModule, RouterTestingModule, FontAwesomeIconsModuleMock, NgbAccordionModule, TableModule],
      providers: [
        { provide: AuthoringApiService, useValue: authoringApiServiceMock },
        { provide: NgbModal },
      ]
    })
    .compileComponents();
  });

  describe('general', () => {

    beforeEach(() => {
      authoringApiServiceMock.slideService.getSlides.and.returnValue(of(dummySlides));
      authoringApiServiceMock.chapterService.getChapter.and.returnValue(of(dummyChapter));
      authoringApiServiceMock.chapterService.deleteChapter.and.returnValue(of(new HttpResponse()));
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.performanceChapter.and.returnValue(of(-1));
      authoringApiServiceMock.contextService.activeOrganization = dummyOrganization;

      fixture = TestBed.createComponent(ChapterDetailComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should change route if the course button is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };
      fixture.detectChanges();
      
      const openCourseSpy = spyOn(component, 'openCourse').and.callThrough();
      const navigateSpy = spyOn(router, 'navigate');

      clickElement(fixture, '#course-button');
      expect(openCourseSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../course'], jasmine.any(Object));
    });

    it('should show chapter title', () => {
      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };
      fixture.detectChanges();

      const debugElem = getHTMLElement(fixture, '#name');
      expect(debugElem.textContent.trim()).toEqual(dummyChapter.title);
    });

    it('should open modal if the chapter edit button is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };
      fixture.detectChanges();

      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummyChapters[0]));

      let openChapterSpy = spyOn(component, 'editChapter').and.callThrough();
      clickElement(fixture, '#editChapter');
      expect(openChapterSpy).toHaveBeenCalledWith();
    });

    it('should "delete" the chapter when "deleteChapter" is clicked', () => {
      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };
      fixture.detectChanges();
      
      const btnId = '#btn-deleteChapter';
      authoringApiServiceMock.chapterService.deleteChapter.and.returnValue(of())

      const debugElem = fixture.debugElement.query(By.css(btnId));
      debugElem.triggerEventHandler('confirm', {});

      fixture.detectChanges(); //so that the observable is refreshed

      expect(authoringApiServiceMock.chapterService.deleteChapter).toHaveBeenCalledWith(dummyChapter);
    });

    it('should open the course again after "deleteChapter" is called', waitForAsync(() => {
      const openCourseSpy = spyOn(component, "openCourse");
      
      component.deleteChapter();
      expect(openCourseSpy).toHaveBeenCalled();
    }));
  });

  describe('w/ slides', () => {

    beforeEach(() => {
      authoringApiServiceMock.slideService.getSlides.and.returnValue(of(dummySlides));
      authoringApiServiceMock.chapterService.getChapter.and.returnValue(of(dummyChapter));
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.performanceChapter.and.returnValue(of(-1));
      authoringApiServiceMock.contextService.activeOrganization = dummyOrganization;

      fixture = TestBed.createComponent(ChapterDetailComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should change route if the slide open button is clicked', () => {
      const openCourseSpy = spyOn(component, 'openSlide').and.callThrough();
      const navigateSpy = spyOn(router, 'navigate');

      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };

      fixture.detectChanges();

      const debugElem = fixture.debugElement.query(By.css(`#slide-table`));
      debugElem.triggerEventHandler('openSlide', dummyChapter.id);
      expect(openCourseSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(['../chapter'], jasmine.any(Object));
    });

    it('should open modal if the slide edit button is clicked', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummySlides[0]));
      const slideId: number = dummySlides[0].id;

      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };
      fixture.detectChanges();

      let editSlideSpy = spyOn(component, 'editSlide').and.callThrough();
      const debugElem = fixture.debugElement.query(By.css(`#slide-table`));
      debugElem.triggerEventHandler('editSlide', slideId);
      expect(editSlideSpy).toHaveBeenCalledWith(slideId);
    });

    it('should call deleteSlide when the delete button is clicked', waitForAsync(() => {
      activatedRoute.snapshot.queryParams = { id: dummyChapter.id };
      fixture.detectChanges();

      const deleteSlideSpy = authoringApiServiceMock.slideService.deleteSlide.and.returnValue(of(new HttpResponse<null>()));

      const debugElem = fixture.debugElement.query(By.css(`#slide-table`));
      debugElem.triggerEventHandler('deleteSlide', dummySlide.id);
      expect(deleteSlideSpy).toHaveBeenCalled();
    }));
  });

  describe('w/o slides', () => {
    beforeEach(() => {
      authoringApiServiceMock.slideService.getSlides.and.returnValue(of([]));
      authoringApiServiceMock.chapterService.getChapter.and.returnValue(of(dummyChapter));
      authoringApiServiceMock.courseService.getCourse.and.returnValue(of(dummyCourse));
      authoringApiServiceMock.chapterService.performanceChapter.and.returnValue(of(-1));
      authoringApiServiceMock.contextService.activeOrganization = dummyOrganization;

      fixture = TestBed.createComponent(ChapterDetailComponent);
      component = fixture.componentInstance;
      router = TestBed.inject(Router)
      activatedRoute = TestBed.inject(ActivatedRoute);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    })

    it('should show a modal for adding a slide when "addSlide" is called', () => {
      let modalMock = new NgbModalRefMock();
      let modalService = TestBed.inject(NgbModal);
      const modalServiceSpy = spyOn(modalService, 'open').and.returnValue(modalMock as NgbModalRef);
      modalMock.result = new Promise((resolve, _) => resolve(dummySlide));

      component.addSlide();
      expect(modalServiceSpy).toHaveBeenCalled();
    });
  });

});
